export default function ContactMap() {
  return (
    <div className="h-[400px] w-full bg-slate-200 rounded-xl overflow-hidden">
      <iframe
        src="https://maps.google.com/maps?q=Kanu%20Street,%20Nakuru&t=&z=15&ie=UTF8&iwloc=&output=embed"
        width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
      />
    </div>
  );
}