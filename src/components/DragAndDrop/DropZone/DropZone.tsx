import clsx from "clsx";
import React, { useEffect, useState } from "react";
import useDndStore, { DndItem } from "../stores/useDndStore";

import "./DropZone.scss";

interface DropZoneProps {
  onDropItem?(item: DndItem): void;
  onDropFiles?(files: FileList): void;
  children: React.ReactNode;
  dragOverClassName?: string;
}

function DropZone({
  onDropItem,
  onDropFiles,
  children,
  dragOverClassName,
}: DropZoneProps) {
  const item = useDndStore((s) => s.item);
  const isDragging = !!item;
  const clearDragging = useDndStore((s) => s.clearDragging);
  const [dragOver, setDragOver] = useState(false);

  /**
   * When there's no longer an item being dragged, clear the state so that
   * this drop zone is no longer highlighted as the current target whenever
   * a draggable item is next picked up.
   *
   * This handles scenarios such as cancelling the drag with the escape key,
   * where no 'drag end' events fire.
   */
  useEffect(() => {
    if (!isDragging) {
      setDragOver(false);
    }
  }, [isDragging]);

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
        // This prevents the drop zone from being lost when hovering
        // over child elements within the drop zone element
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (item) onDropItem?.(item);
        if (e.dataTransfer.files) onDropFiles?.(e.dataTransfer.files);
        clearDragging();
      }}
    >
      {children}
    </div>
  );
}

export default DropZone;
