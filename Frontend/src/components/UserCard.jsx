const UserCard = ({ user }) => (
	<div className="card w-full max-w-sm bg-base-100 shadow-xl overflow-hidden">
		<figure className="h-80 bg-base-200">
			{user.profilePictureURL ? (
				<img
					src={user.profilePictureURL}
					alt={user.firstName}
					className="w-full h-full object-cover"
				/>
			) : (
				<span className="text-base-content/40">No photo</span>
			)}
		</figure>
		<div className="card-body">
			<h2 className="card-title">
				{user.firstName} {user.lastName}
				{user.age ? `, ${user.age}` : ""}
			</h2>
			{user.gender && (
				<p className="text-sm text-base-content/60">{user.gender}</p>
			)}
			{user.aboutMe && <p className="text-base-content/80">{user.aboutMe}</p>}
			{user.interests?.length > 0 && (
				<div className="flex flex-wrap gap-2 mt-2">
					{user.interests.map((interest) => (
						<span key={interest} className="badge badge-primary badge-outline">
							{interest}
						</span>
					))}
				</div>
			)}
		</div>
	</div>
);

export default UserCard;
