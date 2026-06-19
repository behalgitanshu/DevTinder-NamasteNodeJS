import { useRef, useState } from "react";

const SWIPE_THRESHOLD = 100;

const SwipeCard = ({ children, onSwipeLeft, onSwipeRight, className = "" }) => {
	const cardRef = useRef(null);
	const startRef = useRef({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	const handlePointerDown = (e) => {
		setDragging(true);
		startRef.current = { x: e.clientX, y: e.clientY };
		cardRef.current?.setPointerCapture(e.pointerId);
	};

	const handlePointerMove = (e) => {
		if (!dragging) return;
		setOffset({
			x: e.clientX - startRef.current.x,
			y: e.clientY - startRef.current.y,
		});
	};

	const handlePointerUp = () => {
		if (!dragging) return;
		setDragging(false);
		if (offset.x > SWIPE_THRESHOLD) {
			onSwipeRight?.();
		} else if (offset.x < -SWIPE_THRESHOLD) {
			onSwipeLeft?.();
		}
		setOffset({ x: 0, y: 0 });
	};

	const rotate = offset.x / 12;

	return (
		<div
			ref={cardRef}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
			style={{
				transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`,
				transition: dragging ? "none" : "transform 0.3s ease",
				touchAction: "none",
				cursor: dragging ? "grabbing" : "grab",
			}}
			className={className}
		>
			{children}
		</div>
	);
};

export default SwipeCard;
