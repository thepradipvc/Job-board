import { Button, Input } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import meetingImage from "../assets/meeting-image.jpg";
import { register } from "../api/auth";
import { toast } from "sonner";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.clear();
      navigate("/dashboard");
      toast.success("Registered successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    mutation.mutate({ name, email, password });
  };

  return (
    <main className="h-screen grid place-items-center bg-slate-100">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6">Get Started Now</h2>
            <div className="flex flex-col gap-6">
              <div>
                <Input
                  label="Name"
                  labelPlacement="outside"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                isLoading={mutation.isPending}
                onClick={handleSubmit}
                type="submit"
                className="w-full"
                color="primary"
              >
                Sign up
              </Button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-blue-600 hover:underline">
                  Sign In
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
    </main>
  );
}
