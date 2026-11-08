# seated-man-jug-bust (PENDING APPROVAL - not integrated, not registered)

Base: pilot/candidate-seed42.png (approved by Kilian). Style anchor: villager-man-01.
Bust only (waist up), meant to sit behind a table placed by the game. No table, no background.

- Canvas: 48x36, transparent. All frames share it. Waist cut = bottom edge (source row 51).
- Anchor suggestion: bottom-centre (x 24, y 36 = waist line, hidden by the table).
- Visible size: about 37 wide x 33 tall (head top at row 3).
- Unique frames: frames/0-idle, 1-blink, 2-mid, 3-drink.
- Playback: sequence/0..15.png @ 4 fps (4 s loop):
  0,0,0,0,0,1(blink),0,0,0,0,2(mid),3,3(drink),2,0,0
- Head rows 19-29 and body rows >= 48 are copied from one master frame (identical in every
  frame), only forearms + tankard (rows 30-47) change, so no jitter.
- Generation cost: 4 edits x 5 = 20 generations (2 resting + 2 mid candidates; 1 of each used).
- Work files: ../anim-work (lowered-seed7/99, mid-seed5/23). Originals untouched.
