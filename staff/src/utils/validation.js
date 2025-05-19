export const validateNIC = (nic) => {
    if (!nic) return "NIC is required"
  
    // Check for old format (9 digits + V/X) or new format (12 digits)
    const oldFormatRegex = /^[0-9]{9}[vVxX]$/
    const newFormatRegex = /^[0-9]{12}$/
  
    if (!oldFormatRegex.test(nic) && !newFormatRegex.test(nic)) {
      return "NIC must be in format 123456789V (old) or 123456789012 (new)"
    }
  
    return null
  }
  
  export const validatePhone = (phone) => {
    if (!phone) return "Phone number is required"
  
    // Remove any spaces or dashes
    const cleanPhone = phone.replace(/[\s-]/g, "")
  
    // Format: 07XXXXXXXX (10 digits) or +947XXXXXXXX (12 digits)
    const mobileRegex = /^(0|(\+94))7[0-9]{8}$/
  
    if (!mobileRegex.test(cleanPhone)) {
      return "Phone must be a valid Sri Lankan mobile number (e.g., 07XXXXXXXX or +947XXXXXXXX)"
    }
  
    return null
  }
  
  export const validatePassword = (password) => {
    if (!password) return null
  
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
  
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one symbol"
    }
  
    if (!/\d/.test(password)) {
      return "Password must contain at least one number"
    }
  
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
  
    return null
  }
  