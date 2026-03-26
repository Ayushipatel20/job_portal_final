export default function Contact() {
  return (
    <div className="bg-gray-50 text-gray-800">
           <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contact Us
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
            Have questions or want to learn more about our Placement Management System? We're here to help! Reach out to us through the form below or use our contact information.
        </p>
      </section>

      {/* Contact Form */}  
        <section className="py-16 px-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Send Us a Message</h2>
            <form className="space-y-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"      
                />
                <input
                    type="email"        
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <textarea
                    placeholder="Your Message"  
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows="5"
                ></textarea>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Send Message
                </button>
            </form> 
        </section>

        {/* Contact Info */}    

    </div>
);
}