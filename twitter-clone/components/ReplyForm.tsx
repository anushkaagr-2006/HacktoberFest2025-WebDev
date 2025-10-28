"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

interface ReplyFormProps {
  onReply: (content: string) => void;
}

interface FormValues {
  reply: string;
}

export default function ReplyForm({ onReply }: ReplyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const replyValue = watch("reply", "");

  const submitForm = (data: FormValues) => {
    console.log("Submitted:", data);
    onReply(data.reply);
    reset(); 
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="p-4 space-y-2">
      <Textarea
        placeholder="Tweet your reply"
        {...register("reply", { required: "Reply is required" })}
        className="w-full"
      />
      {errors.reply && (
        <p className="text-red-500 text-sm">{errors.reply.message}</p>
      )}

      <Button type="submit" disabled={replyValue.trim().length === 0}>
        Reply
      </Button>
    </form>
  );
}