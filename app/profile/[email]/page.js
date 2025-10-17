import { csvData } from '../../../data/cohortData';
import * as d3 from 'd3';
import ProfileClient from '../../../components/profile/ProfileClient';

// This Server Component fetches the data and passes it to the interactive client page
export default async function ProfilePage({ params }) {
  const userEmail = decodeURIComponent(params.email).toLowerCase();
  const cohortData = d3.csvParse(csvData);
  const userData = cohortData.find(d => d.Email.toLowerCase() === userEmail);

  if (!userData) {
    return <div className="h-screen flex items-center justify-center">User not found.</div>;
  }

  return <ProfileClient userData={userData} cohortData={cohortData} />;
}