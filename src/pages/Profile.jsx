import React from "react";
import { useAuth } from "../AuthProvider";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return <div>Please login to see profile</div>;
  return <div><h2>Profile</h2><pre>{JSON.stringify(user, null, 2)}</pre></div>;
}
