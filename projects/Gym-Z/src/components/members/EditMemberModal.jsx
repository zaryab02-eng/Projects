// Edit a member's personal details (name, phones, age, gender, address,
// Aadhaar, notes). Plan and dates are changed through Renew / Freeze.
import { useEffect, useState } from "react";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import {
  cleanAadhaar,
  formatAadhaar,
  isValidAadhaar,
} from "../../utils/aadhaarUtils.js";

const fromMember = (m) => ({
  fullName: m?.fullName || "",
  phone: m?.phone || "",
  altPhone: m?.altPhone || "",
  age: m?.age ?? "",
  gender: m?.gender || "",
  address: m?.address || "",
  aadhaarNumber: m?.aadhaarNumber || "",
  notes: m?.notes || "",
});

export default function EditMemberModal({
  open,
  onClose,
  member,
  onSubmit,
  submitting,
}) {
  const [values, setValues] = useState(fromMember(member));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setValues(fromMember(member));
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
  };

  const handleSave = () => {
    const errs = {};
    if (!values.fullName.trim()) errs.fullName = "Full name is required";
    if (!/^\+?[0-9]{7,15}$/.test(values.phone.trim()))
      errs.phone = "Enter a valid phone number";
    if (!isValidAadhaar(values.aadhaarNumber))
      errs.aadhaarNumber = "Aadhaar must be 12 digits";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      altPhone: values.altPhone.trim(),
      age: values.age,
      gender: values.gender,
      address: values.address.trim(),
      aadhaarNumber: cleanAadhaar(values.aadhaarNumber),
      notes: values.notes,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Member"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full"
            loading={submitting}
            onClick={handleSave}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Full Name"
          required
          value={values.fullName}
          onChange={handleChange("fullName")}
          error={errors.fullName}
        />
        <Input
          label="Phone Number"
          required
          value={values.phone}
          onChange={handleChange("phone")}
          error={errors.phone}
        />
        <Input
          label="Alternate Phone"
          value={values.altPhone}
          onChange={handleChange("altPhone")}
          placeholder="Optional"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            value={values.age}
            onChange={handleChange("age")}
            placeholder="Optional"
          />
          <Select
            label="Gender"
            value={values.gender}
            onChange={handleChange("gender")}
            options={[
              { value: "", label: "Select" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          />
        </div>
        <Input
          label="Address"
          value={values.address}
          onChange={handleChange("address")}
          placeholder="Optional"
        />
        <Input
          label="Aadhaar Number"
          inputMode="numeric"
          value={formatAadhaar(values.aadhaarNumber)}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              aadhaarNumber: cleanAadhaar(e.target.value),
            }))
          }
          error={errors.aadhaarNumber}
          placeholder="Optional · 12 digits"
        />
        <div>
          <label className="block text-[13px] font-medium text-ink-300 mb-1.5">
            Notes
          </label>
          <textarea
            rows={3}
            value={values.notes}
            onChange={handleChange("notes")}
            placeholder="Optional"
            className="w-full bg-ink-900 border border-ink-600 rounded-lg px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-copper-500 focus:ring-1 focus:ring-copper-500 outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}
