const UserCard = ({ user }) => (
	<div className="group relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-base-200 ring-1 ring-base-300/60 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.45)] transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:shadow-[0_28px_55px_-12px_rgba(0,0,0,0.55)]">
		{user.profilePictureURL ? (
			<img
				src={user.profilePictureURL}
				alt={user.firstName}
				className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
			/>
		) : (
			<div className="absolute inset-0 flex items-center justify-center text-base-content/40">
				No photo
			</div>
		)}

		<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

		<div className="absolute inset-x-0 bottom-0 p-5 text-white">
			<h2 className="text-2xl font-bold leading-tight drop-shadow-sm">
				{user.firstName} {user.lastName}
				{user.age ? `, ${user.age}` : ""}
			</h2>
			{user.gender && (
				<p className="text-sm text-white/75 mt-0.5">{user.gender}</p>
			)}
			{user.aboutMe && (
				<p className="text-sm text-white/90 mt-2 line-clamp-2">
					{user.aboutMe}
				</p>
			)}
			{user.interests?.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mt-3">
					{user.interests.slice(0, 4).map((interest) => (
						<span
							key={interest}
							className="badge badge-sm border-none bg-white/15 text-white backdrop-blur-sm"
						>
							{interest}
						</span>
					))}
				</div>
			)}
		</div>
	</div>
);

export default UserCard;
