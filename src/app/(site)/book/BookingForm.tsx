/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useTransition } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getSlotsAction, createAppointmentAction } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";
// On importe le CSS de base de react-calendar (nécessaire)
import "react-calendar/dist/Calendar.css";

type Service = {
  id: string;
  title: string;
  duration: number;
  priceAmount: any;
  priceCurrency: string | null;
};

export default function BookingForm({ services }: { services: Service[] }) {
  // --- STATES ---
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Service, 2: Date/Heure, 3: Infos
  
  // Données de la réservation
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Formulaire client
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", note: ""
  });

  // États techniques
  const [isPending, startTransition] = useTransition();
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // --- EFFETS ---

  // Quand on change de date ou de service, on recharge les créneaux
  useEffect(() => {
    if (step === 2 && selectedService && date) {
      setSlotsLoading(true);
      setSelectedSlot(null); // Reset choix
      startTransition(async () => {
        const res = await getSlotsAction(date.toISOString(), selectedService.id);
        setSlots(res.slots || []);
        setSlotsLoading(false);
      });
    }
  }, [date, selectedService, step]);

  // --- HANDLERS ---

  const handleDateChange = (value: any) => {
    // React-calendar peut renvoyer un tableau, on s'assure d'avoir une seule date
    if (value instanceof Date) setDate(value);
    else if (Array.isArray(value) && value[0] instanceof Date) setDate(value[0]);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot) return;

    startTransition(async () => {
      const res = await createAppointmentAction({
        serviceId: selectedService.id,
        date: date,
        time: selectedSlot,
        ...formData
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message);
      }
    });
  };

  // --- RENDER ---

  if (success) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg mx-auto border border-green-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <DynamicIcon name="check" className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Réservation Confirmée !</h2>
        <p className="text-gray-600 mb-6">
          Merci {formData.firstName}. Votre rendez-vous pour <strong>{selectedService?.title}</strong> est fixé au :
        </p>
        <div className="bg-gray-50 p-4 rounded-lg font-medium text-gray-800 mb-6">
          {format(date, "EEEE d MMMM yyyy", { locale: fr })} à {selectedSlot}
        </div>
        <button onClick={() => window.location.reload()} className="text-indigo-600 hover:underline">
          Faire une nouvelle réservation
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
      
      {/* HEADER : FIL D'ARIANE */}
      <div className="bg-gray-50 border-b p-4 flex items-center gap-2 text-sm">
        <span className={`font-medium ${step >= 1 ? "text-indigo-600" : "text-gray-400"}`}>1. Prestation</span>
        <span className="text-gray-300">/</span>
        <span className={`font-medium ${step >= 2 ? "text-indigo-600" : "text-gray-400"}`}>2. Date & Heure</span>
        <span className="text-gray-300">/</span>
        <span className={`font-medium ${step >= 3 ? "text-indigo-600" : "text-gray-400"}`}>3. Infos</span>
      </div>

      <div className="p-6 md:p-8">
        
        {/* ÉTAPE 1 : CHOIX SERVICE */}
        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedService(s); setStep(2); }}
                className="text-left p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700">{s.title}</h3>
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {s.priceAmount} {s.priceCurrency}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <DynamicIcon name="clock" className="w-4 h-4" />
                  {s.duration} min
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ÉTAPE 2 : CALENDRIER + CRÉNEAUX */}
        {step === 2 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* CALENDRIER */}
            <div className="flex-1">
              <h3 className="font-semibold mb-4 text-gray-700">Choisissez le jour :</h3>
              {/* Wrapper CSS pour styliser React-Calendar */}
              <div className="calendar-wrapper">
                <Calendar 
                  onChange={handleDateChange} 
                  value={date} 
                  locale="fr-FR"
                  minDate={new Date()} // Pas de date passée
                  tileDisabled={({ date }) => date.getDay() === 0 && false} // Exemple: Désactiver dimanche si besoin (mais géré par backend)
                  className="w-full border-none rounded-lg font-sans"
                />
              </div>
            </div>

            {/* CRÉNEAUX */}
            <div className="flex-1 lg:max-w-[300px]">
               <h3 className="font-semibold mb-4 text-gray-700">
                 Horaires dispos pour le {format(date, "d MMM", { locale: fr })} :
               </h3>
               
               {slotsLoading ? (
                 <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
               ) : slots.length === 0 ? (
                 <div className="text-gray-500 text-sm italic bg-gray-50 p-4 rounded text-center">
                   Aucun créneau disponible ce jour-là. <br/> Essayez une autre date.
                 </div>
               ) : (
                 <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {slots.map(slot => (
                     <button
                       key={slot}
                       onClick={() => setSelectedSlot(slot)}
                       className={`py-2 px-1 text-sm rounded transition-colors ${
                         selectedSlot === slot 
                           ? "bg-indigo-600 text-white shadow-md" 
                           : "bg-white border border-gray-200 hover:border-indigo-400 text-gray-700"
                       }`}
                     >
                       {slot}
                     </button>
                   ))}
                 </div>
               )}

               <div className="mt-8 flex justify-between">
                 <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-800">
                   ← Retour
                 </button>
                 <button 
                   onClick={() => setStep(3)} 
                   disabled={!selectedSlot}
                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700"
                 >
                   Continuer
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : FORMULAIRE */}
        {step === 3 && selectedService && (
          <form onSubmit={submitBooking} className="max-w-md mx-auto space-y-4">
             <div className="bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800 mb-6">
                Vous réservez : <strong>{selectedService.title}</strong><br/>
                Le <strong>{format(date, "EEEE d MMMM", { locale: fr })}</strong> à <strong>{selectedSlot}</strong>.
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Prénom</label>
                 <input required className="input w-full border p-2 rounded" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
               </div>
               <div>
                 <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Nom</label>
                 <input required className="input w-full border p-2 rounded" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
               </div>
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Email</label>
                <input type="email" required className="input w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Téléphone</label>
                <input type="tel" required className="input w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1 uppercase text-gray-500">Note (facultatif)</label>
                <textarea rows={2} className="input w-full border p-2 rounded" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
             </div>

             {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

             <div className="flex justify-between pt-4">
                 <button type="button" onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-gray-800">
                   ← Changer l&apos;heure
                 </button>
                 <button 
                   type="submit" 
                   disabled={isPending}
                   className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
                 >
                   {isPending ? "Validation..." : "Confirmer le RDV"}
                 </button>
             </div>
          </form>
        )}

      </div>
    </div>
  );
}