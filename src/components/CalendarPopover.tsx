// src/components/CalendarPopover.tsx
import React,
{
  useMemo,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useId,
} from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, addDays, isValid } from "date-fns";
import { es } from "date-fns/locale";

export type CalendarPopoverHandle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type Props = {
  value?: string;                 // ISO "yyyy-MM-dd" o ""
  onChange: (iso: string) => void;
  label?: string;                 // placeholder cuando no hay fecha
};

const toISO = (d: Date) => format(d, "yyyy-MM-dd");
const safeParseISO = (iso?: string): Date | undefined => {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return isValid(dt) ? dt : undefined;
};

const CalendarPopover = forwardRef<CalendarPopoverHandle, Props>(
  ({ value = "", onChange, label = "Cualquier fecha" }, ref) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const popId = useId();

    const selected = useMemo(() => safeParseISO(value), [value]);

    // Posicionar el popover junto al botón/label
    const position = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    };

    // Exponer API imperativa
    useImperativeHandle(ref, () => ({
      open: () => { position(); setOpen(true); },
      close: () => setOpen(false),
      toggle: () => { position(); setOpen(v => !v); },
    }));

    // Reposicionar en scroll/resize mientras esté abierto
    useEffect(() => {
      if (!open) return;
      const handle = () => position();
      window.addEventListener("scroll", handle, true);
      window.addEventListener("resize", handle);
      return () => {
        window.removeEventListener("scroll", handle, true);
        window.removeEventListener("resize", handle);
      };
    }, [open]);

    // Cerrar con click afuera y con Esc
    useEffect(() => {
      if (!open) return;
      const onDocClick = (e: MouseEvent) => {
        const t = e.target as Node;
        const pop = document.getElementById(popId);
        if (pop && !pop.contains(t) && !anchorRef.current?.contains(t)) {
          setOpen(false);
        }
      };
      const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
      return () => {
        document.removeEventListener("mousedown", onDocClick);
        document.removeEventListener("keydown", onEsc);
      };
    }, [open, popId]);

    return (
      <div className="relative w-full">
        {/* Botón/label: ahora hace toggle y DETIENE la burbuja */}
        <button
          ref={anchorRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();     // evita que el padre reabra al cerrar
            position();
            setOpen((v) => !v);      // toggle
          }}
          className="flex w-full items-center gap-2 text-left"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span aria-hidden>📅</span>
          <span className="truncate text-sm text-neutral-700">
            {selected ? format(selected, "dd/MM/yyyy", { locale: es }) : label}
          </span>
        </button>

        {/* Popover en PORTAL (z alto) */}
        {open && createPortal(
          <div
            id={popId}
            role="dialog"
            aria-label="Selector de fecha"
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              zIndex: 99999,
            }}
          >
            <div className="w-[320px] rounded-2xl border border-neutral-200 bg-white shadow-xl">
              {/* Presets */}
              <div className="flex flex-wrap gap-2 p-3">
                <button
                  onClick={() => { onChange(""); setOpen(false); }}
                  className={`h-9 rounded-full px-3 text-sm font-medium ${
                    !value ? "bg-violet-600 text-white" : "border border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  Cualquier fecha
                </button>
                <button
                  onClick={() => { onChange(toISO(new Date())); setOpen(false); }}
                  className="h-9 rounded-full px-3 text-sm font-medium border border-neutral-300 hover:bg-neutral-50"
                >
                  Hoy
                </button>
                <button
                  onClick={() => { onChange(toISO(addDays(new Date(), 1))); setOpen(false); }}
                  className="h-9 rounded-full px-3 text-sm font-medium border border-neutral-300 hover:bg-neutral-50"
                >
                  Mañana
                </button>
                <button
                  onClick={() => { onChange(toISO(addDays(new Date(), 7))); setOpen(false); }}
                  className="h-9 rounded-full px-3 text-sm font-medium border border-neutral-300 hover:bg-neutral-50"
                >
                  +7 días
                </button>
              </div>

              {/* Calendario */}
              <div className="px-2 pb-3">
                <DayPicker
                  mode="single"
                  locale={es}
                  selected={selected}
                  onSelect={(d) => {
                    if (d) {
                      onChange(toISO(d));
                      setOpen(false);
                    }
                  }}
                  weekStartsOn={1}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }
);

export default CalendarPopover;
