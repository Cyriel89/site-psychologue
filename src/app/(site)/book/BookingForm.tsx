/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useTransition } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getSlotsAction, createAppointmentAction } from "./actions";
import DynamicIcon from "@/components/DynamicIcon";
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
  // On passe à 4 étapes !
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); 
  
  // Données de la réservation
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [meetingFormat, setMeetingFormat] = useState<"FACE_TO_FACE" | "VISIO" | null>(null); // NOUVEAU
  const [date, setDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ note: "" });

  // États techniques
  const [isPending, startTransition] = useTransition();
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // --- EFFETS ---
  useEffect(() => {
    // Le calendrier est maintenant à l'étape 3
    if (step === 3 && selectedService && date) {
      setSlotsLoading(true);
      setSelectedSlot(null); 
      startTransition(async () => {
        const res = await getSlotsAction(date.toISOString(), selectedService.id);
        setSlots(res.slots || []);
        setSlotsLoading(false);
      });
    }
  }, [date, selectedService, step]);

  // --- HANDLERS ---
  const handleDateChange = (value: any) => {
    if (value instanceof Date) setDate(value);
    else if (Array.isArray(value) && value[0] instanceof Date) setDate(value[0]);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot || !meetingFormat) return;

    startTransition(async () => {
      const res = await createAppointmentAction({
        serviceId: selectedService.id,
        date: date,
        time: selectedSlot,
        notes: formData.note,
        format: meetingFormat // On envoie le format
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
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg mx-auto border border-stone-100">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <DynamicIcon name="check" className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif text-stone-800 mb-2">Moment réservé avec succès</h2>
        <p className="text-stone-600 mb-6">
          Votre séance pour <strong>{selectedService?.title}</strong> est fixée au :
        </p>
        
        <div className="bg-stone-50 p-5 rounded-xl text-stone-800 mb-6 border border-stone-100">
          <div className="font-medium text-lg mb-2">
            {format(date, "EEEE d MMMM yyyy", { locale: fr })} à {selectedSlot}
          </div>
          
          {/* LE FAMEUX MESSAGE ADAPTÉ AU FORMAT */}
          <div className="text-sm border-t border-stone-200 pt-3 mt-2 flex flex-col items-center gap-2 text-stone-600">
            {meetingFormat === "VISIO" ? (
              <>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium inline-block mb-1">En téléconsultation</span>
                <p>Le lien pour rejoindre la séance vidéo sera disponible dans votre espace client, rubrique <strong>Mes Rendez-vous</strong>, quelques minutes avant le début.</p>
              </>
            ) : (
              <>
                <span className="bg-stone-200 text-stone-700 px-3 py-1 rounded-full font-medium inline-block mb-1">Au cabinet</span>
                <p>Je vous attends avec plaisir au cabinet. L&apos;adresse complète est indiquée dans votre espace personnel.</p>
              </>
            )}
          </div>
        </div>

        <button onClick={() => window.location.reload()} className="text-indigo-600 hover:text-indigo-800 underline transition-colors">
          Faire une nouvelle réservation
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden min-h-[500px]">
      
      {/* HEADER : FIL D'ARIANE À 4 ÉTAPES */}
      <div className="bg-stone-50 border-b border-stone-100 p-4 flex flex-wrap items-center gap-2 text-sm">
        <span className={`font-medium ${step >= 1 ? "text-indigo-600" : "text-stone-400"}`}>1. Prestation</span>
        <span className="text-stone-300">/</span>
        <span className={`font-medium ${step >= 2 ? "text-indigo-600" : "text-stone-400"}`}>2. Lieu</span>
        <span className="text-stone-300">/</span>
        <span className={`font-medium ${step >= 3 ? "text-indigo-600" : "text-stone-400"}`}>3. Date & Heure</span>
        <span className="text-stone-300">/</span>
        <span className={`font-medium ${step >= 4 ? "text-indigo-600" : "text-stone-400"}`}>4. Validation</span>
      </div>

      <div className="p-6 md:p-8">
        
        {/* ÉTAPE 1 : CHOIX SERVICE */}
        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedService(s); setStep(2); }}
                className="text-left p-5 rounded-xl border border-stone-200 hover:border-indigo-400 hover:shadow-sm transition-all group bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-stone-800 group-hover:text-indigo-700">{s.title}</h3>
                  <span className="bg-stone-100 text-stone-700 text-xs px-2 py-1 rounded">
                    {s.priceAmount} {s.priceCurrency}
                  </span>
                </div>
                <div className="text-sm text-stone-500 flex items-center gap-2">
                  <DynamicIcon name="clock" className="w-4 h-4" />
                  {s.duration} min
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ÉTAPE 2 : NOUVELLE ÉTAPE FORMAT */}
        {step === 2 && (
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h3 className="text-xl font-serif text-stone-700 mb-6">Comment souhaitez-vous échanger ?</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => { setMeetingFormat("FACE_TO_FACE"); setStep(3); }}
                className="flex flex-col items-center gap-4 p-8 border border-stone-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
              >
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-600">
                  <span className="text-3xl">☕</span> {/* Tu peux remplacer par un DynamicIcon si tu as 'home' ou 'office' */}
                </div>
                <div>
                  <h4 className="font-medium text-stone-800 text-lg">Au cabinet</h4>
                  <p className="text-sm text-stone-500 mt-1">Échangeons en personne, dans un cadre serein et confidentiel.</p>
                </div>
              </button>

              <button
                onClick={() => { setMeetingFormat("VISIO"); setStep(3); }}
                className="flex flex-col items-center gap-4 p-8 border border-stone-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                  <span className="text-3xl">💻</span> {/* Tu peux remplacer par un DynamicIcon 'video' */}
                </div>
                <div>
                  <h4 className="font-medium text-stone-800 text-lg">En visio</h4>
                  <p className="text-sm text-stone-500 mt-1">Depuis chez vous, où que vous soyez via WhatsApp.</p>
                </div>
              </button>
            </div>

            <div className="mt-8 text-left">
              <button onClick={() => setStep(1)} className="text-sm text-stone-500 hover:text-stone-800">
                ← Retour au choix de la prestation
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : CALENDRIER + CRÉNEAUX */}
        {step === 3 && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h3 className="font-semibold mb-4 text-stone-700">Choisissez le jour :</h3>
              <div className="calendar-wrapper">
                <Calendar 
                  onChange={handleDateChange} 
                  value={date} 
                  locale="fr-FR"
                  minDate={new Date()}
                  tileDisabled={({ date }) => date.getDay() === 0 && false}
                  className="w-full border-none rounded-lg font-sans"
                />
              </div>
            </div>

            <div className="flex-1 lg:max-w-[300px]">
               <h3 className="font-semibold mb-4 text-stone-700">
                 Horaires dispos le {format(date, "d MMM", { locale: fr })} :
               </h3>
               
               {slotsLoading ? (
                 <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
               ) : slots.length === 0 ? (
                 <div className="text-stone-500 text-sm italic bg-stone-50 p-4 rounded text-center">
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
                           : "bg-white border border-stone-200 hover:border-indigo-400 text-stone-700"
                       }`}
                     >
                       {slot}
                     </button>
                   ))}
                 </div>
               )}

               <div className="mt-8 flex justify-between">
                 <button onClick={() => setStep(2)} className="text-sm text-stone-500 hover:text-stone-800">
                   ← Changer le lieu
                 </button>
                 <button 
                   onClick={() => setStep(4)} 
                   disabled={!selectedSlot}
                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                 >
                   Continuer
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : FORMULAIRE FINAL */}
        {step === 4 && selectedService && (
          <form onSubmit={submitBooking} className="max-w-md mx-auto space-y-6">
             <div className="bg-indigo-50/50 p-5 rounded-xl text-sm text-indigo-900 border border-indigo-100">
                Vous réservez une séance <strong>{meetingFormat === "VISIO" ? "en visio" : "au cabinet"}</strong> pour :<br/>
                <span className="font-medium text-base block mt-1">{selectedService.title}</span>
                Le <strong>{format(date, "EEEE d MMMM", { locale: fr })}</strong> à <strong>{selectedSlot}</strong>.
             </div>

             <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-stone-500">Note au praticien (facultatif)</label>
                <textarea 
                  rows={3} 
                  placeholder="Un sujet spécifique que vous aimeriez aborder ?"
                  className="w-full border border-stone-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-shadow" 
                  value={formData.note} 
                  onChange={e => setFormData({ note: e.target.value })} 
                />
             </div>

             {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}

             <div className="flex justify-between items-center pt-4">
                 <button type="button" onClick={() => setStep(3)} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                   ← Changer l&apos;heure
                 </button>
                 <button 
                   type="submit" 
                   disabled={isPending}
                   className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors shadow-sm"
                 >
                   {isPending ? "Validation..." : "Confirmer la séance"}
                 </button>
             </div>
          </form>
        )}

      </div>

      <style jsx global>{`
        .calendar-wrapper .react-calendar { width: 100%; border: none; background: white; font-family: inherit; }
        .calendar-wrapper .react-calendar__tile { padding: 12px 0; font-size: 14px; }
        .calendar-wrapper .react-calendar__tile:enabled:hover,
        .calendar-wrapper .react-calendar__tile:enabled:focus { background-color: #e0e7ff; color: #4338ca; border-radius: 8px; }
        .calendar-wrapper .react-calendar__tile--active { background: #4f46e5 !important; color: white !important; border-radius: 8px; }
        .calendar-wrapper .react-calendar__tile--now { background: #f5f5f4; border-radius: 8px; color: #44403c; }
        .calendar-wrapper .react-calendar__navigation button { font-size: 16px; font-weight: 600; }
      `}</style>
    </div>
  );
}