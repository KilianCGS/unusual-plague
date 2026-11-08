# seated-mender (PENDING visual approval - not integrated, not registered)
Base: candidates/candidate-seed29.png (static kept untouched). Anchor: villager-woman-01.
- Canvas 48x72 (crop x24..72, y12..84 of the 96x96 source), transparent. Anchor bottom-centre (24, 70) = stool/feet.
- Unique frames: frames/0-rest, 1-pull (needle hand up, thread visible), 2-push (hand down at the cloth).
- Playback: sequence/0..11.png @ 3 fps (4 s loop): 0,0,0,1,1,0,0,2,2,0,0,0
- Only region x28-45,y18-47 (needle hand + forearm) comes from edits (anim-work/up-seed12, down-seed12);
  every other pixel is identical to the static (checked: 0 pixels differ outside the region).
- Cost: 4 edits x 5 = 20 generations (2 used, 2 spare: up-seed5, down-seed5).
