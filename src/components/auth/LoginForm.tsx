import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="admin@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => navigate("/register")}
                >
                  Register here
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
