"use client";

import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/FormElements";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.string().min(1, "Gender is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: ProfileFormValues;
}

export function EditProfileModal({ isOpen, onClose, initialData }: EditProfileModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: initialData,
    });

    const onSubmit = (data: ProfileFormValues) => {
        console.log("Updated Profile Data:", data);
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={onClose} title="Edit Personal Profile">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        placeholder="John"
                        {...register("firstName")}
                        error={errors.firstName?.message}
                    />
                    <Input
                        label="Last Name"
                        placeholder="Doe"
                        {...register("lastName")}
                        error={errors.lastName?.message}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Gender"
                        options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" },
                        ]}
                        {...register("gender")}
                        error={errors.gender?.message}
                    />
                    <Input
                        label="Country"
                        placeholder="Rwanda"
                        {...register("country")}
                        error={errors.country?.message}
                    />
                </div>

                <Input
                    label="Phone number"
                    placeholder="0793131491"
                    {...register("phone")}
                    error={errors.phone?.message}
                />

                <Input
                    label="Email Address"
                    placeholder="alexarawles@gmail.com"
                    {...register("email")}
                    error={errors.email?.message}
                />

                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                    <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
