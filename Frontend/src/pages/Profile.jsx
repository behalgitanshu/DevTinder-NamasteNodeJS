import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { parseError } from "../utils/errorHandler";
import ErrorAlert from "../components/ErrorAlert";

const Profile = () => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const [firstName, setFirstName] = useState(user?.firstName || "");
	const [lastName, setLastName] = useState(user?.lastName || "");
	const [age, setAge] = useState(user?.age ?? "");
	const [gender, setGender] = useState(user?.gender || "");
	const [interests, setInterests] = useState(user?.interests?.join(", ") || "");
	const [profilePictureURL, setProfilePictureURL] = useState(
		user?.profilePictureURL || "",
	);
	const [aboutMe, setAboutMe] = useState(user?.aboutMe || "");

	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const [saving, setSaving] = useState(false);
	const [uploadingPhoto, setUploadingPhoto] = useState(false);

	const handlePhotoChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setError(null);
		setSuccess(false);
		setUploadingPhoto(true);
		try {
			const formData = new FormData();
			formData.append("photo", file);

			const result = await axios.post(BASE_URL + "/profile/photo", formData, {
				withCredentials: true,
			});
			dispatch(addUser(result.data.user));
			setProfilePictureURL(result.data.user.profilePictureURL);
			setSuccess(true);
		} catch (err) {
			setError(parseError(err));
		} finally {
			setUploadingPhoto(false);
			e.target.value = "";
		}
	};

	const handleSubmit = async (e) => {
		e?.preventDefault();
		setError(null);
		setSuccess(false);
		setSaving(true);
		try {
			const body = {
				firstName,
				lastName,
				gender,
				interests: interests
					.split(",")
					.map((interest) => interest.trim())
					.filter(Boolean),
				profilePictureURL,
				aboutMe,
			};
			if (age !== "") body.age = Number(age);

			const result = await axios.patch(BASE_URL + "/profile/edit", body, {
				withCredentials: true,
			});
			dispatch(addUser(result.data.user));
			setSuccess(true);
		} catch (err) {
			setError(parseError(err));
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="flex-1 bg-base-200 flex items-center justify-center py-10">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
						Edit Profile
					</h2>
					<p className="text-center text-base-content/60 mb-6">
						Keep your profile up to date
					</p>

					<div className="flex flex-col items-center mb-4">
						<div className="relative">
							<div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200">
								{profilePictureURL ? (
									<img
										src={profilePictureURL}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-base-content/40">
										No photo
									</div>
								)}
								{uploadingPhoto && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/40">
										<span className="loading loading-spinner loading-sm text-white" />
									</div>
								)}
							</div>
							<label
								htmlFor="photo-upload"
								className="btn btn-circle btn-primary btn-sm absolute bottom-0 right-0 cursor-pointer"
							>
								📷
							</label>
							<input
								id="photo-upload"
								type="file"
								accept="image/jpeg,image/png,image/webp"
								className="hidden"
								onChange={handlePhotoChange}
								disabled={uploadingPhoto}
							/>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">First Name</span>
							</div>
							<input
								type="text"
								className="input input-bordered w-full"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
								minLength={2}
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">Last Name</span>
							</div>
							<input
								type="text"
								className="input input-bordered w-full"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">Age</span>
							</div>
							<input
								type="number"
								min={18}
								max={120}
								className="input input-bordered w-full"
								value={age}
								onChange={(e) => setAge(e.target.value)}
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">Gender</span>
							</div>
							<select
								className="select select-bordered w-full"
								value={gender}
								onChange={(e) => setGender(e.target.value)}
							>
								<option value="">Prefer not to say</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">
									Interests (comma separated)
								</span>
							</div>
							<input
								type="text"
								placeholder="Hiking, Movies, Cooking"
								className="input input-bordered w-full"
								value={interests}
								onChange={(e) => setInterests(e.target.value)}
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">
									Profile Picture URL
								</span>
							</div>
							<input
								type="url"
								className="input input-bordered w-full"
								value={profilePictureURL}
								onChange={(e) => setProfilePictureURL(e.target.value)}
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text font-medium">About Me</span>
							</div>
							<textarea
								className="textarea textarea-bordered w-full"
								rows={3}
								value={aboutMe}
								onChange={(e) => setAboutMe(e.target.value)}
							/>
						</label>

						<ErrorAlert error={error} onRetry={handleSubmit} />

						{success && (
							<div className="alert alert-success text-sm">
								Profile updated successfully.
							</div>
						)}

						<button
							type="submit"
							className="btn btn-primary w-full mt-2"
							disabled={saving}
						>
							{saving ? "Saving..." : "Save Changes"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Profile;
