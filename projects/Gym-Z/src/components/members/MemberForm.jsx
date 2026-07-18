// Shared Add Member form. Also reused (in a lighter mode) for renewals.
import { useState } from "react";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";

export default function MemberForm({
  plans,
  initialValues = {},
  onSubmit,
  onCancel,
  submitting,
  submitLabel = "Add Member",
}) {
  const [values, setValues] = useState({
    fullName: "",
    phone: "",
    altPhone: "",
    address: "",
    age: "",
    gender: "",
    joiningDate: new Date().toISOString().slice(0, 10),
    planId: plans?.[0]?.id || "",
    membershipFee: plans?.[0]?.fee || "",
    notes: "",
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setValues((v) => {
      const next = { ...v, [key]: value };
      if (key === "planId") {
        const plan = plans.find((p) => p.id === value);
        if (plan) next.membershipFee = plan.fee;
      }
      return next;
    });
  };

  const validate = () => {
    const errs = {};
    if (!values.fullName.trim()) errs.fullName = "Full name is required";
    if (!/^\+?[0-9]{7,15}$/.test(values.phone.trim()))
      errs.phone = "Enter a valid phone number";
    if (!values.planId) errs.planId = "Select a membership plan";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const plan = plans.find((p) => p.id === values.planId);
    onSubmit({
      ...values,
      planName: plan?.name,
      membershipFee: Number(values.membershipFee),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-3">
          Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            required
            value={values.fullName}
            onChange={handleChange("fullName")}
            error={errors.fullName}
            placeholder="e.g. Rohit Sharma"
          />
          <Input
            label="Phone Number"
            required
            value={values.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
            placeholder="+91XXXXXXXXXX"
          />
          <Input
            label="Alternate Phone"
            value={values.altPhone}
            onChange={handleChange("altPhone")}
            placeholder="Optional"
          />
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
              { value: "", label: "Select (optional)" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          />
          <Input
            label="Address"
            value={values.address}
            onChange={handleChange("address")}
            placeholder="Optional"
          />
        </div>
      </section>

      <section className="pt-5 border-t border-ink-700/60">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-3">
          Membership Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Joining Date"
            type="date"
            required
            value={values.joiningDate}
            onChange={handleChange("joiningDate")}
          />
          <Select
            label="Membership Plan"
            required
            value={values.planId}
            onChange={handleChange("planId")}
            error={errors.planId}
            options={plans.map((p) => ({
              value: p.id,
              label: `${p.name} — ₹${p.fee}`,
            }))}
          />
          <Input
            label="Membership Fee (₹)"
            type="number"
            required
            value={values.membershipFee}
            onChange={handleChange("membershipFee")}
            className="sm:col-span-2"
          />
        </div>
      </section>

      <section className="pt-5 border-t border-ink-700/60">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-3">
          Notes
        </h3>
        <textarea
          rows={3}
          value={values.notes}
          onChange={handleChange("notes")}
          placeholder="Optional"
          className="w-full bg-ink-900 border border-ink-600 rounded-lg px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-copper-500 focus:ring-1 focus:ring-copper-500 outline-none"
        />
      </section>

      <div className={onCancel ? "flex gap-3 pt-1" : "pt-1"}>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting} className="w-full">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
