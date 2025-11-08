import { Building2, Phone, Droplet, Trash2, Shield, Ambulance } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col ">

      {/* Departments / Partners Section */}
      <section className="  text-center">
        
        <div className="flex flex-wrap items-center justify-center gap-5">
          <img
            src="/images/images.jpeg"
            alt="Swachh Bharat Mission"
            className="h-20"
          />
          <img
            src="/images/logo.jpg"
            alt="Urban Affairs"
            className="h-20"
          />
          <img
            src="/images/pic.jpeg"
            alt="Smart City Mission"
            className="h-20"
          />
          <img
            src="/images/bmc-logo.png"
            alt="Municipal Corporation"
            className="h-20"
          />
        </div>
      </section>


    <marquee 
  class="text-red-600 text-xl font-bold"
  scrollamount="12"
>
For more details : https://pgportal.gov.in/
</marquee>

      
      {/* Info Section Below Banner */}
      <section className="text-center px-6 py-16 bg-white shadow-md">
        <h1 className="text-5xl font-extrabold text-gray-700 mb-6">
          Welcome to <span className="text-black-800">Smadhan</span>
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed font-bold text-lg max-w-3xl mx-auto">
          Report civic issues like potholes, garbage, or streetlight problems directly to your local
          municipality and track resolutions in real time. Empower your community with transparency
          and efficiency.
        </p>
        <a
          href="/report"
          className="inline-block bg-white text-gray-800 px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Report an Issue
        </a>
      </section>


      {/* Helpline Numbers Section */}
      <section className="py-16 px-6 md:px-16 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-700 mb-10">Important Civic Helplines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <HelplineCard icon={<Building2 className="text-blue-600 w-10 h-10" />} title="Municipal Complaints" number="1916" desc="Register civic issues like roads, garbage, and water leaks." />
          <HelplineCard icon={<Phone className="text-green-600 w-10 h-10" />} title="Electricity Board" number="1912" desc="Report power failures or damaged streetlights." />
          <HelplineCard icon={<Droplet className="text-blue-500 w-10 h-10" />} title="Water Supply" number="155303" desc="Complain about water shortages or pipeline leaks." />
          <HelplineCard icon={<Trash2 className="text-yellow-600 w-10 h-10" />} title="Sanitation & Waste" number="1969" desc="File complaints about garbage collection or sanitation." />
          <HelplineCard icon={<Shield className="text-red-600 w-10 h-10" />} title="Police Helpline" number="100" desc="For emergencies and law enforcement assistance." />
          <HelplineCard icon={<Ambulance className="text-pink-600 w-10 h-10" />} title="Ambulance Service" number="108" desc="Emergency medical help anytime, anywhere." />
        </div>
      </section>

  

      {/* Footer */}
      <footer className=" text-gray-900 text-center py-4 font-bold text-sm">
        © 2025 Smadhan | Making cities better, together.
      </footer>
    </div>
  );
}

// Helpline Card Component
function HelplineCard({ icon, title, number, desc }) {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="flex flex-col items-center">
        {icon}
        <h3 className="text-xl font-semibold mt-3">{title}</h3>
        <p className="text-blue-700 text-lg font-bold mt-1">{number}</p>
        <p className="text-gray-600 text-sm mt-2">{desc}</p>
      </div>
    </div>
  );
}
