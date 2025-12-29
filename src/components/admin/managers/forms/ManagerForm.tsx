"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const managerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  ci: z.string().min(1, "CI is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
  salary: z.number().min(0, "Salary must be positive"),
  branchId: z.string().optional(),
});

export type ManagerFormData = z.infer<typeof managerFormSchema>;

interface ManagerFormProps {
  initialData?: Partial<ManagerFormData>;
  branches: any[];
  isLoadingBranches: boolean;
  onSubmit: (data: ManagerFormData) => void;
  submitButtonText: string;
  isSubmitting: boolean;
  showPassword?: boolean;
}

export function ManagerForm({
  initialData,
  branches,
  isLoadingBranches,
  onSubmit,
  submitButtonText,
  isSubmitting,
  showPassword = false,
}: ManagerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ManagerFormData>({
    resolver: zodResolver(managerFormSchema),
    defaultValues: {
      ...initialData,
      salary: initialData?.salary || 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ci">CI</Label>
        <Input id="ci" {...register("ci")} placeholder="Enter CI number" />
        {errors.ci && (
          <p className="text-sm text-red-500">{errors.ci.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="Enter phone number"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {showPassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="salary">Salary</Label>
        <Input
          id="salary"
          type="number"
          {...register("salary", { valueAsNumber: true })}
          placeholder="Enter salary"
        />
        {errors.salary && (
          <p className="text-sm text-red-500">{errors.salary.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="branchId">Assign to Branch (Optional)</Label>
        <Select
          onValueChange={(value) => setValue("branchId", value)}
          value={watch("branchId") || ""}
          disabled={isLoadingBranches}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No branch assignment</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id.toString()}>
                {branch.name} {branch.isWarehouse ? "(Warehouse)" : "(Store)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Processing..." : submitButtonText}
      </Button>
    </form>
  );
}
