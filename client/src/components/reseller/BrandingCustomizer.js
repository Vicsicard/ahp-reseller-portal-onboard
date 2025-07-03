import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import styles from './BrandingCustomizer.module.css';

/**
 * BrandingCustomizer Component
 * Allows resellers to customize their landing page branding (logo and primary color)
 */
const BrandingCustomizer = ({ resellerId, initialBranding = {}, onSave }) => {
  // State for branding elements
  const [primaryColor, setPrimaryColor] = useState(initialBranding.primaryColor || '#0066CC');
  const [logo, setLogo] = useState(initialBranding.logoUrl || '');
  const [logoFile, setLogoFile] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create preview URL for the reseller landing page
  useEffect(() => {
    if (resellerId) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      setPreviewUrl(`${baseUrl}/r/${resellerId}`);
    }
  }, [resellerId]);

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or SVG)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo file size must be less than 2MB');
      return;
    }

    setLogoFile(file);
    
    // Create a preview URL for the selected file
    const objectUrl = URL.createObjectURL(file);
    setLogo(objectUrl);
    setError('');
  };

  // Handle color change from color picker
  const handleColorChange = (color) => {
    setPrimaryColor(color.hex);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('primaryColor', primaryColor);
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Send request to update branding
      const response = await axios.post(`/api/resellers/${resellerId}/branding`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess('Branding updated successfully!');
        
        // Call the onSave callback with the updated branding
        if (onSave) {
          onSave({
            primaryColor,
            logoUrl: response.data.data.logoUrl || logo
          });
        }
      }
    } catch (err) {
      console.error('Error updating branding:', err);
      setError(err.response?.data?.message || 'Failed to update branding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open the landing page preview in a new tab
  const openPreview = () => {
    window.open(previewUrl, '_blank');
  };

  return (
    <div className={styles.brandingCustomizer}>
      <h2 className={styles.title}>Customize Your Landing Page</h2>
      <p className={styles.subtitle}>
        Personalize your landing page with your brand colors and logo
      </p>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="logo" className={styles.label}>
            Company Logo
          </label>
          <div className={styles.logoUploadContainer}>
            {logo ? (
              <div className={styles.logoPreview}>
                <img src={logo} alt="Company Logo" className={styles.logoImage} />
                <button 
                  type="button" 
                  className={styles.removeLogoBtn}
                  onClick={() => {
                    setLogo('');
                    setLogoFile(null);
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className={styles.logoPlaceholder}>
                <span>Upload your logo</span>
              </div>
            )}
            <input
              type="file"
              id="logo"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleLogoChange}
              className={styles.fileInput}
            />
            <label htmlFor="logo" className={styles.uploadBtn}>
              Select Logo
            </label>
            <p className={styles.helperText}>
              Recommended: PNG or SVG with transparent background, 250x80px
            </p>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Primary Color</label>
          <div className={styles.colorPickerContainer}>
            <div 
              className={styles.colorSwatch}
              style={{ backgroundColor: primaryColor }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            <input 
              type="text" 
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className={styles.colorInput}
            />
            {showColorPicker && (
              <div className={styles.colorPickerPopover}>
                <div 
                  className={styles.colorPickerCover}
                  onClick={() => setShowColorPicker(false)}
                />
                <ChromePicker 
                  color={primaryColor}
                  onChange={handleColorChange}
                  disableAlpha
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.previewSection}>
          <div className={styles.previewBox} style={{ 
            '--preview-color': primaryColor,
            backgroundImage: `linear-gradient(45deg, ${primaryColor}, ${primaryColor}88)`
          }}>
            {logo && <img src={logo} alt="Logo Preview" className={styles.previewLogo} />}
            <h3 className={styles.previewTitle}>Your Branded Landing Page</h3>
            <button 
              type="button" 
              className={styles.previewBtn}
              onClick={openPreview}
              disabled={!previewUrl}
            >
              Preview Landing Page
            </button>
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Branding'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandingCustomizer;
