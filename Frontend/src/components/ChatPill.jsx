const ChatPill = ({ user }) => (
	<div className="flex items-center gap-4 w-full bg-base-100 hover:bg-base-200 transition-colors rounded-full shadow-md ring-1 ring-base-300/60 px-4 py-3 cursor-pointer">
		<div className="avatar shrink-0">
			<div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
				<img src={user.profilePictureURL} alt={user.firstName} />
			</div>
		</div>

		<div className="flex-1 min-w-0">
			<h3 className="font-semibold truncate">
				{user.firstName} {user.lastName}
			</h3>
			<p className="text-sm text-base-content/60 truncate">
				{user.interests?.length ? user.interests.join(" • ") : "Say hi 👋"}
			</p>
		</div>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			className="text-base-content/40 shrink-0"
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
		</svg>
	</div>
);

export default ChatPill;
