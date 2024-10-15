import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import meetingImage from "../assets/meeting-image.jpg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { login } from "../api/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.clear();
      navigate("/dashboard");
      toast.success("Logged in successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    mutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        <div className=" flex-col md:flex-row flex">
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
            <div className="flex flex-col gap-6">
              <div>
                <Input
                  label="Email address"
                  labelPlacement="outside"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  label="Password"
                  labelPlacement="outside"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                onClick={handleSubmit}
                type="submit"
                className="w-full"
                color="primary"
              >
                Sign in
              </Button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New here?{" "}
                <Link to="/sign-up" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          <div className="md:w-1/2 border-l flex items-center justify-center">
            <img
              src={meetingImage}
              alt="Illustration of people working"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
