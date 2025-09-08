const doorImages = {
  2: "/assets/image/2PanelSlidingDoor.png",
  3: "/assets/image/3PanelSlidingDoor.png",
};

export const getDoorImage = (numberOfPanels) => {
  if (!numberOfPanels) return null;
  return doorImages[numberOfPanels] || null;
};
