"use client";

import { useState } from "react";

type ModalType = "seller" | "supplier" | "forwarder" | null;

interface FormData {
    name: string;
    email: string;
    phone: string;
    businessName: string;
    businessType: string;
    location: string;
    description: string;
}

export function AboutPage() {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        businessType: "",
        location: "",
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent, type: string) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate form submission
            const emailBody = `
New ${type} Application:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Business Name: ${formData.businessName}
Business Type: ${formData.businessType}
Location: ${formData.location}
Description: ${formData.description}

Application Type: ${type}
Submitted: ${new Date().toLocaleString()}
      `;

            console.log("Sending email to contact@sellub.com:", emailBody);

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setSubmitSuccess(true);
            setTimeout(() => {
                setActiveModal(null);
                setSubmitSuccess(false);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    businessName: "",
                    businessType: "",
                    location: "",
                    description: "",
                });
            }, 2000);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setActiveModal(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            businessName: "",
            businessType: "",
            location: "",
            description: "",
        });
    };

    // Material Design Input Component
    const MaterialInput = ({
        label,
        name,
        type = "text",
        required = false,
        value,
        onChange,
        placeholder,
    }: {
        label: string;
        name: string;
        type?: string;
        required?: boolean;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        placeholder?: string;
    }) => (
        <div className="relative mb-6">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="peer w-full border-b-2 border-gray-300 bg-transparent px-4 py-3 text-gray-900 placeholder-transparent transition-colors duration-200 focus:border-green-500 focus:outline-none"
            />
            <label className="absolute -top-2 left-4 text-sm text-gray-600 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-green-500">
                {label} {required && "*"}
            </label>
        </div>
    );

    // Material Design Select Component
    const MaterialSelect = ({
        label,
        name,
        required = false,
        value,
        onChange,
        options,
    }: {
        label: string;
        name: string;
        required?: boolean;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
        options: { value: string; label: string }[];
    }) => (
        <div className="relative mb-6">
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="peer w-full border-b-2 border-gray-300 bg-transparent px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-green-500 focus:outline-none"
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <label className="absolute -top-2 left-4 text-sm text-gray-600 transition-colors duration-200 peer-focus:text-green-500">
                {label} {required && "*"}
            </label>
        </div>
    );

    // Material Design Textarea Component
    const MaterialTextarea = ({
        label,
        name,
        required = false,
        value,
        onChange,
        placeholder,
    }: {
        label: string;
        name: string;
        required?: boolean;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        placeholder?: string;
    }) => (
        <div className="relative mb-6">
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                rows={3}
                className="peer w-full resize-none border-b-2 border-gray-300 bg-transparent px-4 py-3 text-gray-900 placeholder-transparent transition-colors duration-200 focus:border-green-500 focus:outline-none"
            />
            <label className="absolute -top-2 left-4 text-sm text-gray-600 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-green-500">
                {label} {required && "*"}
            </label>
        </div>
    );

    // Material Design Card Component
    const MaterialCard = ({
        children,
        className = "",
        elevation = "md",
    }: {
        children: React.ReactNode;
        className?: string;
        elevation?: "sm" | "md" | "lg" | "xl";
    }) => {
        const elevationClasses = {
            sm: "shadow-sm",
            md: "shadow-md",
            lg: "shadow-lg",
            xl: "shadow-xl",
        };

        return (
            <div className={`rounded-lg bg-white ${elevationClasses[elevation]} ${className}`}>{children}</div>
        );
    };

    // Material Design Button Component
    const MaterialButton = ({
        children,
        variant = "contained",
        color = "primary",
        size = "medium",
        onClick,
        type = "button",
        disabled = false,
        className = "",
    }: {
        children: React.ReactNode;
        variant?: "contained" | "outlined" | "text";
        color?: "primary" | "secondary" | "error";
        size?: "small" | "medium" | "large";
        onClick?: () => void;
        type?: "button" | "submit";
        disabled?: boolean;
        className?: string;
    }) => {
        const baseClasses =
            "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform active:scale-95";

        const sizeClasses = {
            small: "px-3 py-1.5 text-sm",
            medium: "px-4 py-2 text-base",
            large: "px-6 py-3 text-lg",
        };

        const variantClasses = {
            contained: {
                primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg",
                secondary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg",
                error: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg",
            },
            outlined: {
                primary: "border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500",
                secondary: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
                error: "border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500",
            },
            text: {
                primary: "text-green-600 hover:bg-green-50 focus:ring-green-500",
                secondary: "text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
                error: "text-red-600 hover:bg-red-50 focus:ring-red-500",
            },
        };

        const disabledClasses = disabled ? "opacity-50 cursor-not-allowed transform-none" : "";

        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant][color]} ${disabledClasses} ${className}`}
            >
                {children}
            </button>
        );
    };

    // Material Design Modal Component
    const MaterialModal = ({ type, title }: { type: string; title: string }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                        <button
                            onClick={closeModal}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {submitSuccess ? (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                                <svg
                                    className="h-10 w-10 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="mb-2 text-xl font-bold text-gray-900">Application Submitted Successfully!</h4>
                            <p className="text-gray-600">
                                We'll review your application and get back to you within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={(e) => handleSubmit(e, type)} className="space-y-2">
                            <MaterialInput
                                label="Full Name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                            />

                            <MaterialInput
                                label="Email Address"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                            />

                            <MaterialInput
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                            />

                            <MaterialInput
                                label="Business Name"
                                name="businessName"
                                type="text"
                                required
                                value={formData.businessName}
                                onChange={handleInputChange}
                            />

                            <MaterialSelect
                                label="Business Type"
                                name="businessType"
                                required
                                value={formData.businessType}
                                onChange={handleInputChange}
                                options={[
                                    { value: "retail", label: "Retail Store" },
                                    { value: "wholesale", label: "Wholesale" },
                                    { value: "manufacturing", label: "Manufacturing" },
                                    { value: "services", label: "Services" },
                                    { value: "food", label: "Food & Beverage" },
                                    { value: "fashion", label: "Fashion & Apparel" },
                                    { value: "electronics", label: "Electronics" },
                                    { value: "other", label: "Other" },
                                ]}
                            />

                            <MaterialInput
                                label="Location (City/Region)"
                                name="location"
                                type="text"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g., Accra, Kumasi, Tamale"
                            />

                            <MaterialTextarea
                                label="Tell us about your business"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Brief description of your business and what you'd like to achieve on Sellub..."
                            />

                            <div className="flex space-x-3 pt-6">
                                <MaterialButton variant="outlined" color="secondary" onClick={closeModal} className="flex-1">
                                    Cancel
                                </MaterialButton>
                                <MaterialButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Application"}
                                </MaterialButton>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Material Design Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-yellow-500 to-red-500"></div>
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
                            About{" "}
                            <span className="inline-block transform transition-transform duration-200 hover:scale-105">
                                Sellub
                            </span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl opacity-90 md:text-2xl">
                            Connecting Ghana's business ecosystem through innovative supply chain technology
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Introduction Cards */}
                    <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <MaterialCard elevation="lg" className="p-8">
                            <h2 className="mb-6 text-3xl font-bold text-gray-900">Revolutionizing Ghana's Supply Chain</h2>
                            <p className="mb-6 text-lg leading-relaxed text-gray-600">
                                Sellub operates on the cutting-edge{" "}
                                <strong className="text-green-600">DDS (Duaba Delivery System)</strong>, a comprehensive
                                supply chain platform that optimizes the movement of goods from manufacturers to customers
                                while providing complete visibility through trackable updates.
                            </p>
                            <p className="text-lg leading-relaxed text-gray-600">
                                We bridge the gap between local distributors, suppliers, and end customers, creating a
                                streamlined marketplace that empowers Ghanaian businesses to reach their full potential.
                            </p>
                        </MaterialCard>

                        <MaterialCard
                            elevation="lg"
                            className="bg-gradient-to-br from-green-50 to-yellow-50 p-8 text-center"
                        >
                            <div className="mb-6 text-8xl">🚚</div>
                            <h3 className="mb-4 text-3xl font-bold text-gray-900">DDS Platform</h3>
                            <div className="space-y-2 text-gray-600">
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <span>Real-time tracking</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                    <span>Supply optimization</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    <span>End-to-end visibility</span>
                                </div>
                            </div>
                        </MaterialCard>
                    </div>

                    {/* How It Works */}
                    <MaterialCard elevation="lg" className="mb-16 p-8">
                        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">How Sellub Works</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="group text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 transition-transform duration-200 group-hover:scale-110">
                                    <span className="text-3xl">🏭</span>
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-gray-900">Suppliers Connect</h3>
                                <p className="leading-relaxed text-gray-600">
                                    Manufacturers and suppliers join our platform to showcase their products and connect with
                                    distributors across Ghana.
                                </p>
                            </div>
                            <div className="group text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-200 group-hover:scale-110">
                                    <span className="text-3xl">🏪</span>
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-gray-900">Distributors Sell</h3>
                                <p className="leading-relaxed text-gray-600">
                                    Local distributors get access to quality products and sell directly to customers through
                                    their dedicated storefronts.
                                </p>
                            </div>
                            <div className="group text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 transition-transform duration-200 group-hover:scale-110">
                                    <span className="text-3xl">🚛</span>
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-gray-900">Seamless Delivery</h3>
                                <p className="leading-relaxed text-gray-600">
                                    Our logistics partners ensure fast, reliable delivery with full tracking from warehouse to
                                    customer doorstep.
                                </p>
                            </div>
                        </div>
                    </MaterialCard>

                    {/* Call to Action */}
                    <MaterialCard elevation="xl" className="relative mb-16 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-yellow-600"></div>
                        <div className="relative p-8 text-center text-white md:p-12">
                            <h2 className="mb-4 text-4xl font-bold">Join the Sellub Ecosystem</h2>
                            <p className="mb-8 text-xl opacity-90">
                                Whether you're a supplier, distributor, or logistics partner, there's a place for you in our
                                growing network.
                            </p>
                            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
                                <MaterialButton
                                    variant="contained"
                                    size="large"
                                    onClick={() => setActiveModal("seller")}
                                    className="bg-white text-green-600 shadow-lg hover:bg-gray-100"
                                >
                                    Become a Distributor
                                </MaterialButton>
                                <MaterialButton
                                    variant="contained"
                                    size="large"
                                    onClick={() => setActiveModal("supplier")}
                                    className="bg-white text-green-600 shadow-lg hover:bg-gray-100"
                                >
                                    Join as Supplier
                                </MaterialButton>
                                <MaterialButton
                                    variant="contained"
                                    size="large"
                                    onClick={() => setActiveModal("forwarder")}
                                    className="bg-white text-green-600 shadow-lg hover:bg-gray-100"
                                >
                                    Partner with Logistics
                                </MaterialButton>
                            </div>
                        </div>
                    </MaterialCard>

                    {/* Features Grid */}
                    <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: "📊",
                                title: "Real-time Analytics",
                                desc: "Track sales, inventory, and customer behavior",
                                color: "green",
                            },
                            {
                                icon: "🔒",
                                title: "Secure Payments",
                                desc: "Mobile money and bank transfer support",
                                color: "yellow",
                            },
                            {
                                icon: "📍",
                                title: "Location Tracking",
                                desc: "GPS tracking for all deliveries",
                                color: "red",
                            },
                            {
                                icon: "🤝",
                                title: "24/7 Support",
                                desc: "Dedicated support for all partners",
                                color: "blue",
                            },
                        ].map((feature, index) => (
                            <MaterialCard
                                key={index}
                                elevation="md"
                                className="group p-6 text-center transition-shadow duration-200 hover:shadow-lg"
                            >
                                <div
                                    className={`h-16 w-16 bg-${feature.color}-100 mx-auto mb-4 flex items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110`}
                                >
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className="mb-2 font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.desc}</p>
                            </MaterialCard>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <MaterialCard elevation="lg" className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">Get in Touch</h2>
                        <p className="mb-8 text-lg text-gray-600">
                            Have questions about joining Sellub? We're here to help you get started.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <a
                                href="mailto:contact@sellub.com"
                                className="flex items-center space-x-3 text-lg font-medium text-green-600 transition-colors duration-200 hover:text-green-700"
                            >
                                <span className="text-2xl">📧</span>
                                <span>contact@sellub.com</span>
                            </a>
                            <MaterialButton
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => (window.location.href = "/")}
                            >
                                Explore Marketplace
                            </MaterialButton>
                        </div>
                    </MaterialCard>
                </div>
            </section>

            {/* Modals */}
            {activeModal === "seller" && <MaterialModal type="Distributor" title="Become a Distributor" />}
            {activeModal === "supplier" && <MaterialModal type="Supplier" title="Join as Supplier" />}
            {activeModal === "forwarder" && (
                <MaterialModal type="Logistics Partner" title="Partner with Logistics" />
            )}
        </div>
    );
}
