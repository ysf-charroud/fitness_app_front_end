import { useState } from "react";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function PhoneNumberField({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="phone">Phone Number</Label>
      <PhoneInput
        country={"ma"} // Default Morocco 🇲🇦
        value={value || ""}
        onChange={(val) => onChange?.({ target: { value: val } })}
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: false,
        }}
        containerClass="w-full"
        inputClass="!w-full !h-11 !text-sm !border !border-gray-300 !rounded-lg !px-12 !py-2 focus:!border-black focus:!shadow-none"
        buttonClass="!border-gray-300 !rounded-l-lg"
      />
    </div>
  );
}
