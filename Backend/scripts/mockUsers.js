const FIRST_NAMES = [
	"Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna",
	"Ishaan", "Rohan", "Kabir", "Aryan", "Dhruv", "Karthik", "Yash", "Rahul",
	"Ananya", "Diya", "Saanvi", "Aadhya", "Kiara", "Myra", "Ira", "Anika",
	"Navya", "Riya", "Sara", "Tara", "Zoya", "Meera", "Priya", "Neha",
	"Liam", "Noah", "Oliver", "Elijah", "James", "William", "Benjamin", "Lucas",
	"Emma", "Olivia", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia",
];

const LAST_NAMES = [
	"Sharma", "Verma", "Gupta", "Kumar", "Singh", "Patel", "Mehta", "Reddy",
	"Nair", "Iyer", "Rao", "Joshi", "Malhotra", "Kapoor", "Chopra", "Bansal",
	"Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
];

const GENDERS = ["Male", "Female", "Other"];

const INTERESTS_POOL = [
	"Travel", "Music", "Reading", "Coding", "Hiking", "Photography", "Cooking",
	"Gaming", "Fitness", "Movies", "Art", "Dancing", "Yoga", "Cycling",
	"Football", "Cricket", "Chess", "Writing", "Gardening", "Singing",
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomAge = () => 18 + Math.floor(Math.random() * 25); // 18-42

const randomInterests = () => {
	const count = 1 + Math.floor(Math.random() * 4); // 1-4 interests
	const shuffled = [...INTERESTS_POOL].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
};

// Generates `count` mock users with plain-text passwords that satisfy the
// signup strong-password rule (upper, lower, number, 6+ chars).
const generateMockUsers = (count = 200) => {
	const users = [];

	for (let i = 1; i <= count; i++) {
		const firstName = randomItem(FIRST_NAMES);
		const lastName = randomItem(LAST_NAMES);

		users.push({
			firstName,
			lastName,
			email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@codemate-mock.dev`,
			password: `Mock${i}Pass`,
			age: randomAge(),
			gender: randomItem(GENDERS),
			interests: randomInterests(),
			aboutMe: `Hi, I'm ${firstName}! Always up for a good chat about ${randomItem(INTERESTS_POOL).toLowerCase()}.`,
		});
	}

	return users;
};

module.exports = { generateMockUsers };
