import { useState, useEffect } from "react";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

export default function PlanFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  submitting,
  cancelLabel = "Cancel",
}) {
  const [values, setValues] = useState({ name: "", durationDays: "", fee: "" });

  useEffect(() => {
    setValues(initialValues || { name: "", durationDays: "", fee: "" });
  }, [initialValues, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...values,
      durationDays: Number(values.durationDays),
      fee: Number(values.fee),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? "Edit Plan" : "New Membership Plan"}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onClose}
            disabled={submitting}
          >
            {cancelLabel}
          </Button>
          {/* form="plan-form" submits the <form> below even though this
              button now lives in the modal's separate sticky footer. */}
          <Button
            type="submit"
            form="plan-form"
            loading={submitting}
            className="w-full"
          >
            {initialValues ? "Save Changes" : "Create Plan"}
          </Button>
        </>
      }
    >
      <form id="plan-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Plan Name"
          required
          placeholder="e.g. 30 Days"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
        <Input
          label="Duration (days)"
          type="number"
          required
          placeholder="30"
          value={values.durationDays}
          onChange={(e) =>
            setValues((v) => ({ ...v, durationDays: e.target.value }))
          }
        />
        <Input
          label="Fee (₹)"
          type="number"
          required
          placeholder="700"
          value={values.fee}
          onChange={(e) => setValues((v) => ({ ...v, fee: e.target.value }))}
        />
      </form>
    </Modal>
  );
}
