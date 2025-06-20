import React from "react";
import DatabaseManager from "../components/DatabaseManager";

export default function Database() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <DatabaseManager />
      </div>
    </div>
  );
}
