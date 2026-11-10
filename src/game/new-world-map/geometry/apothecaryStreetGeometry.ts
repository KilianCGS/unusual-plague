import type { LogicalRect, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const apothecaryStreetColliders: SceneCollider[] = [
  { id: "apothecary-street-1", x: 0, y: 845, width: 267, height: 69 },
  { id: "apothecary-street-2", x: 464, y: 845, width: 264, height: 69 },
  { id: "apothecary-street-3", x: 473, y: 564, width: 104, height: 56 },
  { id: "apothecary-street-4", x: 536, y: 678, width: 48, height: 67 },
  { id: "apothecary-street-5", x: 193, y: 0, width: 141, height: 339 },
  { id: "apothecary-street-6", x: 249, y: 0, width: 154, height: 310 },
  { id: "apothecary-street-7", x: 242, y: 559, width: 20, height: 52 },
  { id: "apothecary-street-8", x: 411, y: 59, width: 278, height: 308 },
  { id: "apothecary-street-9", x: 389, y: 282, width: 29, height: 27 },
  { id: "apothecary-street-10", x: 0, y: 0, width: 181, height: 365 },
  { id: "apothecary-street-11", x: 162, y: 316, width: 32, height: 26 },
  { id: "apothecary-street-12", x: 220, y: 338, width: 15, height: 30 },
  { id: "apothecary-street-13", x: 262, y: 336, width: 28, height: 33 },
  { id: "apothecary-street-14", x: 293, y: 338, width: 23, height: 21 },
  { id: "apothecary-street-15", x: 231, y: 362, width: 27, height: 19 },
  { id: "apothecary-street-16", x: 0, y: 360, width: 155, height: 90 },
  { id: "apothecary-street-17", x: 140, y: 695, width: 29, height: 27 },
  { id: "apothecary-street-18", x: 0, y: 552, width: 129, height: 185 },
  { id: "apothecary-street-19", x: 115, y: 551, width: 28, height: 123 },
  { id: "apothecary-street-20", x: 148, y: 589, width: 28, height: 31 },
  { id: "apothecary-street-21", x: 0, y: 730, width: 94, height: 26 },
  { id: "apothecary-street-22", x: 473, y: 459, width: 246, height: 109 },
  { id: "apothecary-street-23", x: 466, y: 459, width: 10, height: 155 },
  { id: "apothecary-street-24", x: 34, y: 451, width: 231, height: 90 },
  { id: "apothecary-street-25", x: 193, y: 542, width: 72, height: 21 },
  { id: "apothecary-street-26", x: 34, y: 538, width: 111, height: 13 },
  { id: "apothecary-street-27", x: 36, y: 817, width: 200, height: 27 },
  { id: "apothecary-street-28", x: 586, y: 742, width: 46, height: 14 },
  { id: "apothecary-street-29", x: 630, y: 757, width: 11, height: 88 },
  { id: "apothecary-street-30", x: 467, y: 818, width: 161, height: 25 },
  { id: "apothecary-street-31", x: 467, y: 807, width: 25, height: 13 },
  { id: "apothecary-street-32", x: 464, y: 731, width: 28, height: 74 },
  { id: "apothecary-street-33", x: 238, y: 692, width: 27, height: 151 },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const apothecaryStreetOccluders: OcclusionShape[] = [
  { id: "apothecary-street-depth-1", depthY: 458, points: [{ x: 465, y: 458 }, { x: 464, y: 431 }, { x: 491, y: 431 }, { x: 501, y: 438 }, { x: 527, y: 437 }, { x: 547, y: 436 }, { x: 548, y: 413 }, { x: 563, y: 412 }, { x: 562, y: 458 }] },
  { id: "apothecary-street-depth-2", depthY: 450, points: [{ x: 157, y: 413 }, { x: 156, y: 450 }, { x: 267, y: 450 }, { x: 266, y: 433 }, { x: 262, y: 430 }, { x: 241, y: 430 }, { x: 236, y: 435 }, { x: 213, y: 436 }, { x: 209, y: 438 }, { x: 207, y: 436 }, { x: 182, y: 436 }, { x: 182, y: 417 }, { x: 179, y: 413 }] },
  { id: "apothecary-street-depth-3", depthY: 587, points: [{ x: 174, y: 576 }, { x: 179, y: 571 }, { x: 183, y: 568 }, { x: 184, y: 563 }, { x: 176, y: 567 }, { x: 174, y: 566 }, { x: 173, y: 562 }, { x: 170, y: 565 }, { x: 169, y: 568 }, { x: 165, y: 565 }, { x: 162, y: 561 }, { x: 160, y: 561 }, { x: 159, y: 567 }, { x: 159, y: 569 }, { x: 148, y: 569 }, { x: 150, y: 573 }, { x: 151, y: 574 }, { x: 154, y: 579 }, { x: 156, y: 581 }, { x: 153, y: 582 }, { x: 149, y: 584 }, { x: 150, y: 587 }, { x: 184, y: 586 }, { x: 179, y: 583 }, { x: 182, y: 579 }, { x: 183, y: 575 }] },
  { id: "apothecary-street-depth-4", depthY: 816, points: [{ x: 37, y: 815 }, { x: 37, y: 791 }, { x: 40, y: 787 }, { x: 44, y: 787 }, { x: 49, y: 790 }, { x: 48, y: 815 }, { x: 53, y: 814 }, { x: 54, y: 792 }, { x: 58, y: 787 }, { x: 64, y: 792 }, { x: 64, y: 816 }, { x: 68, y: 815 }, { x: 67, y: 791 }, { x: 72, y: 786 }, { x: 79, y: 791 }, { x: 77, y: 815 }, { x: 83, y: 815 }, { x: 83, y: 790 }, { x: 90, y: 787 }, { x: 94, y: 792 }, { x: 94, y: 815 }, { x: 100, y: 815 }, { x: 100, y: 791 }, { x: 106, y: 787 }, { x: 111, y: 790 }, { x: 111, y: 813 }, { x: 116, y: 813 }, { x: 116, y: 790 }, { x: 123, y: 787 }, { x: 127, y: 793 }, { x: 128, y: 813 }, { x: 133, y: 813 }, { x: 134, y: 793 }, { x: 140, y: 787 }, { x: 146, y: 791 }, { x: 145, y: 812 }, { x: 150, y: 811 }, { x: 150, y: 792 }, { x: 156, y: 787 }, { x: 160, y: 793 }, { x: 160, y: 812 }, { x: 166, y: 811 }, { x: 166, y: 793 }, { x: 172, y: 787 }, { x: 178, y: 792 }, { x: 176, y: 812 }, { x: 183, y: 812 }, { x: 183, y: 793 }, { x: 187, y: 789 }, { x: 192, y: 793 }, { x: 191, y: 813 }, { x: 198, y: 812 }, { x: 197, y: 794 }, { x: 203, y: 789 }, { x: 208, y: 792 }, { x: 207, y: 811 }, { x: 213, y: 811 }, { x: 213, y: 794 }, { x: 217, y: 789 }, { x: 223, y: 795 }, { x: 221, y: 814 }, { x: 227, y: 813 }, { x: 229, y: 791 }, { x: 234, y: 786 }, { x: 239, y: 791 }, { x: 239, y: 812 }] },
  { id: "apothecary-street-depth-5", depthY: 808, points: [{ x: 240, y: 798 }, { x: 35, y: 798 }, { x: 35, y: 808 }, { x: 239, y: 806 }] },
  { id: "apothecary-street-depth-6", depthY: 789, points: [{ x: 155, y: 786 }, { x: 153, y: 782 }, { x: 154, y: 779 }, { x: 156, y: 778 }, { x: 151, y: 776 }, { x: 154, y: 772 }, { x: 159, y: 770 }, { x: 154, y: 766 }, { x: 165, y: 764 }, { x: 157, y: 759 }, { x: 170, y: 757 }, { x: 165, y: 751 }, { x: 165, y: 749 }, { x: 166, y: 747 }, { x: 169, y: 746 }, { x: 173, y: 744 }, { x: 171, y: 740 }, { x: 172, y: 736 }, { x: 176, y: 736 }, { x: 177, y: 735 }, { x: 178, y: 732 }, { x: 186, y: 731 }, { x: 187, y: 731 }, { x: 187, y: 727 }, { x: 190, y: 724 }, { x: 194, y: 726 }, { x: 196, y: 721 }, { x: 201, y: 720 }, { x: 203, y: 723 }, { x: 210, y: 727 }, { x: 214, y: 727 }, { x: 221, y: 726 }, { x: 221, y: 730 }, { x: 226, y: 732 }, { x: 228, y: 737 }, { x: 234, y: 738 }, { x: 236, y: 743 }, { x: 236, y: 746 }, { x: 242, y: 749 }, { x: 242, y: 757 }, { x: 242, y: 789 }] },
  { id: "apothecary-street-depth-7", depthY: 820, points: [{ x: 493, y: 818 }, { x: 493, y: 791 }, { x: 498, y: 785 }, { x: 504, y: 792 }, { x: 503, y: 820 }, { x: 510, y: 819 }, { x: 509, y: 794 }, { x: 516, y: 787 }, { x: 522, y: 794 }, { x: 521, y: 820 }, { x: 528, y: 819 }, { x: 528, y: 793 }, { x: 533, y: 787 }, { x: 540, y: 794 }, { x: 539, y: 819 }, { x: 546, y: 819 }, { x: 545, y: 793 }, { x: 550, y: 786 }, { x: 556, y: 790 }, { x: 555, y: 819 }, { x: 562, y: 818 }, { x: 561, y: 792 }, { x: 567, y: 786 }, { x: 572, y: 791 }, { x: 572, y: 819 }, { x: 577, y: 818 }, { x: 578, y: 793 }, { x: 584, y: 787 }, { x: 589, y: 791 }, { x: 589, y: 818 }, { x: 596, y: 818 }, { x: 595, y: 792 }, { x: 602, y: 787 }, { x: 608, y: 793 }, { x: 607, y: 817 }, { x: 614, y: 817 }, { x: 615, y: 792 }, { x: 619, y: 787 }, { x: 625, y: 792 }, { x: 628, y: 798 }, { x: 629, y: 817 }] },
  { id: "apothecary-street-depth-8", depthY: 809, points: [{ x: 613, y: 798 }, { x: 494, y: 799 }, { x: 494, y: 809 }, { x: 628, y: 808 }, { x: 628, y: 798 }] },
  { id: "apothecary-street-depth-9", depthY: 729, points: [{ x: 464, y: 729 }, { x: 464, y: 709 }, { x: 480, y: 707 }, { x: 493, y: 709 }, { x: 493, y: 729 }] },
  { id: "apothecary-street-depth-10", depthY: 692, points: [{ x: 239, y: 691 }, { x: 239, y: 662 }, { x: 241, y: 659 }, { x: 262, y: 659 }, { x: 266, y: 661 }, { x: 266, y: 692 }] },
  { id: "apothecary-street-depth-11", depthY: 696, points: [{ x: 169, y: 694 }, { x: 166, y: 689 }, { x: 168, y: 685 }, { x: 171, y: 682 }, { x: 166, y: 681 }, { x: 165, y: 676 }, { x: 165, y: 675 }, { x: 160, y: 674 }, { x: 157, y: 678 }, { x: 150, y: 684 }, { x: 148, y: 677 }, { x: 143, y: 675 }, { x: 139, y: 676 }, { x: 145, y: 683 }, { x: 141, y: 686 }, { x: 137, y: 688 }, { x: 138, y: 693 }, { x: 141, y: 696 }] },
];

// TRANSITIONS (yellow): activation zones.
export const apothecaryStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "apothecary-street-transition-1", x: 269, y: 890, width: 186, height: 20 },
  { id: "apothecary-street-transition-2", x: 336, y: 317, width: 54, height: 24 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const apothecaryStreetSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "apothecary-street-spawn-1", x: 364, y: 422, direction: "south" },
  { id: "apothecary-street-spawn-2", x: 364, y: 844, direction: "south" },
];
