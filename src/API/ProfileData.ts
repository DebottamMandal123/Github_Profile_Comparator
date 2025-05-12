import axios from "axios"

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const getGithubProfileContributions = async (username: string, year: number) => {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  const variables = { username };

  const response = await axios.post(
    'https://api.github.com/graphql',
    { query, variables },
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    }
  );

  return {
    year,
    totalContributions: response.data.data.user.contributionsCollection.contributionCalendar.totalContributions,
  };
}

export const getGithubProfileInformations = async (username: string) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`
            }
        });
        return {
            name: response.data.name,
            created_at: response.data.created_at,
        };
    }
    catch(err){
        console.error("Error fetching the profile information ",err);
        throw new Error("Error fetching the profile information");
    }
}