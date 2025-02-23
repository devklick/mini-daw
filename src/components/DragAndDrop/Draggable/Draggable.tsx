import React from "react";
import useDndStore from "../stores/useDndStore";
import "./Draggable.scss";

interface DraggableProps {
  itemId: string;
  itemType: "sample";
  children?: React.ReactNode;
}

function Draggable({ itemId, itemType, children }: DraggableProps) {
  const setDragging = useDndStore((s) => s.setDragging);
  const clearDragging = useDndStore((s) => s.clearDragging);

  return (
    <div
      className="draggable-item"
      draggable
      onDragStart={() => setDragging(itemId, itemType)}
      onDragEnd={() => clearDragging()}
    >
      {children}
    </div>
  );
}

export default Draggable;
