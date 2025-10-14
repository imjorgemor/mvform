"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordOverlayProps {
  onCorrectPassword: () => void;
}

export function PasswordOverlay({ onCorrectPassword }: PasswordOverlayProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      onCorrectPassword();
      localStorage.setItem("appAccess", "granted");
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <h2 className="text-2xl font-semibold text-center">Enter Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter password to access the app"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? "border-destructive" : ""}
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}