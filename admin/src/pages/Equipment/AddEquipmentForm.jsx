import { useState } from "react";
import { addEquipment } from "../../services/api";
import FormHeader from "../../components/AddEquipmentForm/FormHeader";
import AlertMessage from "../../components/AddEquipmentForm/AlertMessage";
import BasicInfoSection from "../../components/AddEquipmentForm/BasicInfoSection";
import DatesInfoSection from "../../components/AddEquipmentForm/DatesInfoSection";
import StatusSection from "../../components/AddEquipmentForm/StatusSection";
import SubmitButton from "../../components/AddEquipmentForm/SubmitButton";

const AddEquipmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "AVAILABLE",
    purchaseDate: "",
    lastMaintenanceDate: "",
    warrantyExpiry: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const equipmentData = {
      name: formData.name,
      category: formData.category,
      status: formData.status,
      purchaseDate: formData.purchaseDate,
      lastMaintenanceDate: formData.lastMaintenanceDate || null,
      warrantyExpiry: formData.warrantyExpiry || null,
    };

    try {
      await addEquipment(equipmentData);
      setSuccess(true);
      setFormData({
        name: "",
        category: "",
        status: "AVAILABLE",
        purchaseDate: "",
        lastMaintenanceDate: "",
        warrantyExpiry: "",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error adding equipment: ", error);
      setError("Failed to add equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-full sm:max-w-3xl">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100">
          
          <FormHeader 
            title="Add New Equipment"
            subtitle="Fill out the form below to add new equipment to the gym inventory system."
          />
          
          <div className="p-5 sm:p-6 md:p-8">
            {error && <AlertMessage type="error" message={error} />}
            {success && <AlertMessage type="success" message="Equipment added successfully! You can add another one." />}
            
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <BasicInfoSection 
                formData={formData}
                handleChange={handleChange}
                loading={loading}
              />

              <DatesInfoSection 
                formData={formData}
                handleChange={handleChange}
                loading={loading}
              />

              <StatusSection 
                formData={formData}
                handleChange={handleChange}
                loading={loading}
              />

              <SubmitButton loading={loading} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEquipmentForm;