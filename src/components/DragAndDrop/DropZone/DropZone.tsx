import clsx from "clsx";
import React, { useState } from "react";
import useDndStore, { DndItem } from "../stores/useDndStore";

import "./DropZone.scss";

interface DropZoneProps {
  onDrop(item: DndItem): void;
  children: React.ReactNode;
  dragOverClassName?: string;
}

function DropZone({ onDrop, children, dragOverClassName }: DropZoneProps) {
  const item = useDndStore((s) => s.item);
  const isDragging = !!item;
  const clearDragging = useDndStore((s) => s.clearDragging);
  const [dragOver, setDragOver] = useState(false);
  // TODO: Need to fix a bug where, when dragging a sample over a track then pressing escape,
  // the drag-over style is still incorrectly being used.
  return (
    <div
      className={clsx("drop-zone", {
        ["drop-zone--drag-over"]: isDragging && dragOver,
        [dragOverClassName ?? ""]: dragOverClassName && isDragging && dragOver,
      })}
      onDragExit={() => setDragOver(false)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragOver(true)}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setDragOver(false);
        }
      }}
      onDrop={() => {
        setDragOver(false);
        clearDragging();
        if (item) onDrop(item);
      }}
    >
      {children}
    </div>
  );
}

export default DropZone;
