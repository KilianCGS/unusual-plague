"use client";

import { playSound } from "../audio/audioPlayer";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { craftingCopy } from "../i18n/crafting";
import { farmerAnalysisLabel } from "../dialogue/chapter2AnalysisDialogues";
import type { Language } from "../i18n/types";
import { countItem, type InventoryState } from "../inventory/inventory";
import { getMissingIngredients, type ItemNeed } from "./needs";
import { getItemIcon, getItemName } from "../items/items";
import { ItemIcon } from "../items/ItemIcon";
import { InventorySlotContents } from "../inventory/InventorySlotView";
import { InventorySlotTooltip } from "../inventory/InventorySlotTooltip";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import {
  availableUnits,
  canAttemptCombine,
  combine,
  createEmptySelection,
  deselectSlot,
  selectItem,
  type CraftSelection,
} from "./crafting";
import { RECIPES, expandKnownRecipeIds, type CraftStation, type Recipe } from "./recipes";
import styles from "./CraftingOverlay.module.css";

// What the feedback line says (null = nothing). It clears as soon as the
// selection changes, so it never needs a timer.
type Message =
  | "no-recipe"
  | "no-space"
  | "limit"
  | "not-needed"
  | "enough"
  | "needed-elsewhere"
  | null;


// How many raw ingredients the known cases still lack in total.
function totalMissing(treatments: readonly ItemNeed[], inventory: InventoryState) {
  return getMissingIngredients(treatments, inventory).reduce(
    (sum, need) => sum + need.quantity,
    0,
  );
}

type Created = { itemId: string; quantity: number };

// The crafting interface of one station, top to bottom: its name and the
// ingredients counter, the ingredient slots of the station, the button, the
// feedback line and the Doctor's inventory. Click an inventory item to put ONE
// unit in the next free slot, click a filled slot to take it out. Choosing
// consumes nothing (the inventory shows what is still FREE to select, derived
// from the real stock and the selection); only the button does, and only when
// it matches a recipe of this station. All the rules live in crafting.ts; this
// component only draws and forwards clicks. It does not check which recipes
// the Doctor knows (see combine). Mount it with key={station} so a different
// station starts with a clean selection (closing the overlay always does).
// How long a station takes to make something (the kitchen simmers; the others are instant).
export const CRAFT_DURATION_MS: Partial<Record<CraftStation, number>> = { fire: 3000 };

export function CraftingOverlay({
  station,
  inventory,
  language,
  onInventoryChange,
  onClose,
  onAnalyzeSample,
  craftableOutputs,
  neededOutputs,
  activeTreatments,
  onOpenMortar,
  onBackToTable,
  onOpenBoard,
  onBackToKitchen,
  onCookingChange,
  knownRecipeIds,
}: {
  station: CraftStation;
  inventory: InventoryState;
  language: Language;
  onInventoryChange: (inventory: InventoryState) => void;
  onClose: () => void;
  onAnalyzeSample?: () => void;
  // The prepared items the known cases still need (see getCraftingTargets).
  // When given, any other recipe is refused and consumes nothing; left out
  // (the /dev/crafting page), every valid recipe can be made.
  craftableOutputs?: ReadonlySet<string>;
  // Everything the day needs (as if nothing were carried): a result in here but not in craftableOutputs
  // means "I already have all I need" (2026-11-16).
  neededOutputs?: ReadonlySet<string>;
  // The treatments the known cases still need. When given, a craft that would
  // leave them MORE short than before is refused too (grinding the herb that
  // another cure needs whole), and nothing is consumed.
  activeTreatments?: readonly ItemNeed[];
  // The mortar button of the work table, and the way back from the mortar.
  onOpenMortar?: () => void;
  onBackToTable?: () => void;
  // The cutting board button of the kitchen, and the way back from the board.
  onOpenBoard?: () => void;
  onBackToKitchen?: () => void;
  // Tells the scene behind that the kitchen is cooking (steam and a livelier fire).
  onCookingChange?: (cooking: boolean) => void;
  // The recipes the Doctor knows: the list of the station and the result preview only show these (left out, as in
  // /dev/crafting: every recipe).
  knownRecipeIds?: ReadonlySet<string>;
}) {
  const copy = craftingCopy[language];
  const [selection, setSelection] = useState<CraftSelection>(() =>
    createEmptySelection(station),
  );
  const [message, setMessage] = useState<Message>(null);
  const [created, setCreated] = useState<Created | null>(null);
  // A successful recipe of a station that takes time (the kitchen) does not give the item at
  // once: the interface closes into a "Preparing..." bar, and only then the stock changes.
  const [preparing, setPreparing] = useState<{ inventory: InventoryState; created: Created } | null>(null);
  const modalOpen = created !== null;
  // The kitchen's sound lasts as long as the wait; cancelling the wait cuts it.
  const cookingSound = useRef<HTMLAudioElement | null>(null);
  const selectedCount = selection.filter(
    (selected) => selected !== null,
  ).length;
  // 2026-11-27 (Kilian): every station looks and works the same. Its tabs (the table: Prepare | Grind; the kitchen:
  // Cook | Chop) replace the mortar and board icons; the known recipes of the tab are listed (a click on one that
  // can be made fills the slots); the result shows as soon as the slots form a known recipe; the bag sits on the
  // right and its items can be dragged to the slots (or clicked, as before).
  const known = knownRecipeIds ? expandKnownRecipeIds(knownRecipeIds) : null;
  const stationRecipes = RECIPES.filter((recipe) => recipe.station === station && (!known || known.has(recipe.id)));
  const matched = matchRecipe(stationRecipes, selection);
  const tabs: { station: CraftStation; go?: () => void }[] | null =
    station === "manual" || station === "mortar"
      ? onOpenMortar || onBackToTable
        ? [{ station: "manual", go: onBackToTable }, { station: "mortar", go: onOpenMortar }]
        : null
      : onOpenBoard || onBackToKitchen
        ? [{ station: "fire", go: onBackToKitchen }, { station: "chop", go: onOpenBoard }]
        : null;

  // Esc: closes the success modal first, otherwise the station. Space closes
  // the modal. (Q and TAB are blocked by the owner while this is open.)
  // The scene behind shows steam while the pot works (and always stops when this closes).
  const isPreparing = preparing !== null;
  useEffect(() => {
    onCookingChange?.(isPreparing);
    return () => onCookingChange?.(false);
  }, [isPreparing, onCookingChange]);

  useEffect(() => {
    return () => cookingSound.current?.pause();
  }, []);

  // The wait is over: the stock changes and the success modal shows.
  useEffect(() => {
    if (!preparing) return;
    const id = window.setTimeout(() => {
      onInventoryChange(preparing.inventory);
      setCreated(preparing.created);
      setPreparing(null);
      // the cooking sound is longer than the wait: it ends with it
      cookingSound.current?.pause();
      cookingSound.current = null;
      playSound("craft.recipeCrafted");
    }, CRAFT_DURATION_MS[station] ?? 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preparing]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();

        if (preparing) {
          // cancelling the wait gives nothing and consumes nothing
          cookingSound.current?.pause();
          cookingSound.current = null;
          setPreparing(null);
        } else if (modalOpen) {
          setCreated(null);
        } else {
          onClose();
        }
      } else if (event.code === "Space" && modalOpen) {
        event.preventDefault();
        setCreated(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, onClose, preparing]);

  function handleInventoryClick(itemId: string) {
    if (!selection.includes(null)) {
      // every ingredient slot of the station is taken
      setMessage("limit");
      return;
    }

    // an item with no free unit left does nothing (its slot looks spent)
    if (availableUnits(inventory, selection, itemId) > 0) {
      playSound("ui.itemClickDrop");
      setMessage(null);
      setSelection(selectItem(inventory, selection, itemId));
    }
  }

  // A click on a recipe of the list that can be made puts its ingredients in the slots (nothing is consumed yet).
  function fillRecipe(recipe: Recipe) {
    let next = createEmptySelection(station);
    for (const input of recipe.inputs) {
      for (let unit = 0; unit < input.quantity; unit++) next = selectItem(inventory, next, input.itemId);
    }
    playSound("ui.itemClickDrop");
    setMessage(null);
    setSelection(next);
  }

  function handleSlotClick(slotIndex: number) {
    setMessage(null);
    playSound("ui.itemClickDrop");
    setSelection((current) => deselectSlot(current, slotIndex));
  }

  function handleCombine() {
    const result = combine(inventory, station, selection);

    if (
      result.kind === "success" &&
      craftableOutputs &&
      !craftableOutputs.has(result.recipe.output.itemId)
    ) {
      // Nothing is consumed: the selection stays so it can be corrected.
      setMessage(neededOutputs?.has(result.recipe.output.itemId) ? "enough" : "not-needed");
    } else if (
      result.kind === "success" &&
      activeTreatments &&
      totalMissing(activeTreatments, result.inventory) >
        totalMissing(activeTreatments, inventory)
    ) {
      setMessage("needed-elsewhere");
    } else if (result.kind === "success") {
      const made = {
        itemId: result.recipe.output.itemId,
        quantity: result.recipe.output.quantity,
      };
      setSelection(createEmptySelection(station));
      setMessage(null);
      if (CRAFT_DURATION_MS[station]) {
        cookingSound.current = playSound("craft.cooking");
        setPreparing({ inventory: result.inventory, created: made });
      } else {
        onInventoryChange(result.inventory);
        setCreated(made);
        // chopping and grinding have their own sound; the table just finishes the recipe
        if (station === "chop") playSound("craft.chop");
        else if (station === "mortar") playSound("craft.mortar");
        else playSound("craft.recipeCrafted");
      }
    } else {
      // Nothing is consumed and the selection stays so it can be corrected.
      setMessage(result.kind);
    }
  }

  if (preparing) {
    return (
      <div
        className={`${styles.backdrop} ${styles.backdropPreparing}`}
        style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
        data-crafting-preparing
      >
        <div className={styles.border}>
          <div className={styles.preparing}>
            <p className={styles.preparingText}>{copy.preparing}</p>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ animationDuration: `${CRAFT_DURATION_MS[station]}ms` }} />
            </div>
            <p className={styles.preparingHint}>{copy.preparingHint}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-crafting-overlay
      data-crafting-station={station}
    >
      <div className={styles.border}>
        <div
          className={`${styles.paper}${modalOpen ? ` ${styles.inert}` : ""}`}
        >
          <button
            type="button"
            className={styles.close}
            aria-label={copy.close}
            onClick={onClose}
          >
            ×
          </button>
          {tabs ? (
            <div className={styles.tabs} role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.station}
                  type="button"
                  role="tab"
                  aria-selected={tab.station === station}
                  className={tab.station === station ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                  data-crafting-tab={tab.station}
                  disabled={modalOpen}
                  onClick={() => {
                    if (tab.station !== station) tab.go?.();
                  }}
                >
                  {copy.title[tab.station]}
                </button>
              ))}
            </div>
          ) : (
            <h2 className={styles.title}>{copy.title[station]}</h2>
          )}
          <div className={styles.columns}>
            <div className={styles.work}>
              {station === "manual" && onAnalyzeSample ? (
                <button type="button" className={styles.action} onClick={onAnalyzeSample} disabled={modalOpen}>
                  {farmerAnalysisLabel[language]}
                </button>
              ) : null}
              <p className={styles.counter} data-crafting-counter>
                {station === "mortar" || station === "chop" ? copy.mortar.ingredient : copy.ingredients} {selectedCount}/{selection.length}
              </p>

              <div
                className={styles.selection}
                data-crafting-selection
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const itemId = event.dataTransfer.getData("text/plain");
                  if (itemId) handleInventoryClick(itemId);
                }}
              >
                {selection.map((selected, index) => (
                  <div key={index} className={styles.selectionCell}>
                    {index > 0 ? <span className={styles.plus}>+</span> : null}
                    <button
                      type="button"
                      className={styles.cell}
                      data-selection-slot
                      data-item-id={selected ?? undefined}
                      aria-label={selected ? getItemName(selected, language) : undefined}
                      disabled={selected === null}
                      onClick={() => handleSlotClick(index)}
                    >
                      {selected ? (
                        getItemIcon(selected) ? (
                          <ItemIcon itemId={selected} className={styles.cellIcon} />
                        ) : (
                          <span className={styles.cellName}>{getItemName(selected, language)}</span>
                        )
                      ) : null}
                    </button>
                  </div>
                ))}
                <span className={styles.arrow} aria-hidden="true">→</span>
                <div className={styles.result} data-crafting-result={matched?.output.itemId}>
                  {matched ? (
                    getItemIcon(matched.output.itemId) ? (
                      <ItemIcon itemId={matched.output.itemId} className={styles.cellIcon} />
                    ) : (
                      <span className={styles.cellName}>{getItemName(matched.output.itemId, language)}</span>
                    )
                  ) : (
                    <span className={styles.resultUnknown}>?</span>
                  )}
                </div>
              </div>
              <p className={styles.resultName} data-crafting-result-name>
                {matched ? getItemName(matched.output.itemId, language) : copy.resultUnknown}
              </p>

              <button
                type="button"
                className={styles.action}
                data-crafting-combine
                disabled={!canAttemptCombine(selection, station)}
                onClick={handleCombine}
              >
                {copy.action[station]}
              </button>
              <p className={styles.message} role="status" data-crafting-message={message ?? undefined}>
                {message === "no-recipe"
                  ? copy.noRecipe
                  : message === "no-space"
                    ? copy.noSpace
                    : message === "limit"
                      ? copy.limitReached
                      : message === "enough"
                        ? copy.alreadyEnough
                        : message === "not-needed"
                          ? copy.notNeeded
                          : message === "needed-elsewhere"
                            ? copy.neededElsewhere
                            : " "}
              </p>

              <h3 className={styles.heading}>{copy.recipesHeading}</h3>
              <ul className={styles.recipes} data-crafting-recipes>
                {stationRecipes.length === 0 ? (
                  <li className={styles.recipeNone}>{copy.noRecipesHere}</li>
                ) : (
                  stationRecipes.map((recipe) => {
                    const ready = recipe.inputs.every((input) => countItem(inventory, input.itemId) >= input.quantity);

                    return (
                      <li key={recipe.id}>
                        <button
                          type="button"
                          className={styles.recipe}
                          data-recipe={recipe.id}
                          data-ready={ready}
                          disabled={!ready || modalOpen}
                          onClick={() => fillRecipe(recipe)}
                        >
                          <span className={styles.recipeMark} aria-hidden="true">{ready ? "✓" : "✗"}</span>
                          <span className={styles.recipeName}>{getItemName(recipe.output.itemId, language)}</span>
                          <span className={styles.recipeInputs}>
                            {recipe.inputs
                              .map(({ itemId, quantity }) => `${getItemName(itemId, language)}${quantity > 1 ? ` ×${quantity}` : ""}`)
                              .join(" + ")}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>

            <div className={styles.side}>
              <h3 className={styles.heading}>{copy.inventoryHeading}</h3>
              <div className={styles.inventory}>
                {inventory.slots.map((slot, index) => {
                  // What is still free to select: the real stock minus the units
                  // already in the ingredient slots. The inventory is untouched.
                  const free = slot
                    ? {
                        itemId: slot.itemId,
                        quantity: availableUnits(inventory, selection, slot.itemId),
                      }
                    : null;
                  const spent = free !== null && free.quantity === 0;

                  return (
                    <button
                      key={index}
                      type="button"
                      className={styles.slot}
                      data-inventory-slot
                      data-item-id={slot?.itemId}
                      data-spent={spent}
                      disabled={free === null}
                      aria-disabled={spent || undefined}
                      aria-label={free ? `${getItemName(free.itemId, language)} x${free.quantity}` : undefined}
                      draggable={free !== null && !spent}
                      onDragStart={(event) => {
                        if (slot) event.dataTransfer.setData("text/plain", slot.itemId);
                      }}
                      onClick={() => slot && handleInventoryClick(slot.itemId)}
                    >
                      <InventorySlotContents slot={free} language={language} classes={styles} />
                      {free ? <InventorySlotTooltip slot={free} language={language} /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {created ? (
        <div className={styles.modalBackdrop} data-crafting-success>
          <div className={styles.modalBorder}>
            <div className={styles.modal}>
              <button
                type="button"
                className={styles.close}
                aria-label={copy.closeModal}
                onClick={() => setCreated(null)}
              >
                ×
              </button>
              <p className={styles.createdHeading}>{copy.created}</p>
              <ItemIcon
                itemId={created.itemId}
                className={styles.createdIcon}
              />
              <p className={styles.createdName}>
                {getItemName(created.itemId, language)} ×{created.quantity}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// The known recipe of this tab that the slots form exactly (the same ingredients, the same number of each), if any.
function matchRecipe(recipes: readonly Recipe[], selection: CraftSelection): Recipe | null {
  const chosen = selection.filter((selected): selected is string => selected !== null);
  if (chosen.length === 0) return null;
  const counts = new Map<string, number>();
  for (const itemId of chosen) counts.set(itemId, (counts.get(itemId) ?? 0) + 1);

  return (
    recipes.find((recipe) => {
      const need = new Map<string, number>();
      for (const { itemId, quantity } of recipe.inputs) need.set(itemId, (need.get(itemId) ?? 0) + quantity);
      if (need.size !== counts.size) return false;
      return [...need].every(([itemId, quantity]) => counts.get(itemId) === quantity);
    }) ?? null
  );
}
