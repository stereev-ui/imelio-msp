'use client'

import { useActionState } from 'react'
import { CheckCircle2, MessageSquare } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitEnquiry, type EnquiryState } from '@/app/actions'

const initialState: EnquiryState = { status: 'idle' }

export function EnquiryDialog({
  propertyId,
  propertyTitle,
  address,
}: {
  propertyId: string
  propertyTitle: string
  address: string
}) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState)

  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <MessageSquare className="size-4" aria-hidden="true" />
        Quick Enquiry
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-primary">Enquire about this property</DialogTitle>
          <DialogDescription>
            {propertyTitle} · {address}
          </DialogDescription>
        </DialogHeader>

        {state.status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center" role="status">
            <CheckCircle2 className="size-10 text-accent" aria-hidden="true" />
            <p className="text-sm text-foreground">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="propertyId" value={propertyId} />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`name-${propertyId}`}>Full name</Label>
              <Input id={`name-${propertyId}`} name="name" required autoComplete="name" maxLength={100} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`email-${propertyId}`}>Email</Label>
                <Input id={`email-${propertyId}`} name="email" type="email" required autoComplete="email" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`phone-${propertyId}`}>Phone (optional)</Label>
                <Input
                  id={`phone-${propertyId}`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+27 82 123 4567"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`message-${propertyId}`}>Message</Label>
              <Textarea
                id={`message-${propertyId}`}
                name="message"
                rows={3}
                maxLength={1000}
                defaultValue={`Hi, I'm interested in ${propertyTitle} (${propertyId}). Please contact me with more details.`}
              />
            </div>
            {state.status === 'error' && (
              <p className="text-sm text-destructive" role="alert">
                {state.message}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
            >
              {pending ? 'Sending…' : 'Send enquiry'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
