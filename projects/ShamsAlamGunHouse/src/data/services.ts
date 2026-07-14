import type { Service } from '@/types'

/**
 * Service catalogue shown in the Services section.
 * `icon` must be one of the ServiceIconName values mapped in
 * components/sections/Services.tsx.
 */
export const services: Service[] = [
  {
    id: 'repair',
    title: 'Gun Repair',
    description:
      'Diagnostic and mechanical repair for licensed firearms — trigger, action, and feed mechanism work carried out to factory tolerances.',
    icon: 'wrench',
  },
  {
    id: 'restoration',
    title: 'Gun Restoration',
    description:
      'Full restoration of antique and heirloom firearms, returning function and finish while preserving historical character.',
    icon: 'sparkles',
  },
  {
    id: 'cleaning',
    title: 'Cleaning & Maintenance',
    description:
      'Deep cleaning, lubrication and preventive maintenance to keep your firearm functioning safely between services.',
    icon: 'droplets',
  },
  {
    id: 'refinishing',
    title: 'Metal Refinishing',
    description:
      'Cold and hot blueing, polishing and rust removal on barrels, actions and fittings using traditional and modern methods.',
    icon: 'flame',
  },
  {
    id: 'stock-restoration',
    title: 'Wooden Stock Restoration',
    description:
      'Hand-sanding, oiling and refinishing of walnut and teak stocks, including crack repair and checkering touch-up.',
    icon: 'trees',
  },
  {
    id: 'safety-inspection',
    title: 'Safety Inspection',
    description:
      'Comprehensive safety and function inspection with a written report, recommended ahead of hunting season or resale.',
    icon: 'shield-check',
  },
  {
    id: 'scope-mounting',
    title: 'Scope Mounting',
    description:
      'Precision scope and sight mounting with bore-sighting, using calibrated tools for a secure, repeatable zero.',
    icon: 'crosshair',
  },
  {
    id: 'servicing',
    title: 'General Servicing',
    description:
      'Routine, licence-compliant servicing packages tailored to shotguns, rifles and other legally held firearms.',
    icon: 'settings',
  },
]
