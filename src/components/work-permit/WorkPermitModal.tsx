import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  BellRing,
  Sparkles,
  MessageCircle,
  X,
  FileCheck,
  AlertCircle,
  Printer,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import { ADToBS } from "bikram-sambat-js";
import { useEffect, useRef, useState } from "react";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import THTTLogo from "../../assets/images/THTTLogo.png";
import { PaymentMethod } from "../reusable/PaymentMethod";
import { createWorkPermitApplication, getPermitFeeTiers, initiatePayment } from "../../api/BackendApi";
import { isSessionValid, clearAuthSession } from "../../utils/sessionManager";
interface CountryProps {
  id: number;
  country_code: string;
  country_name: string;
  iso_2: string;
  flag_code: string;
  short_description?: string;
  processing_days?: number;
  status?: string;
}
// export type FileKeys =
//   | "passport"
//   | "visaCopy"
//   | "experienceCert"
//   | "photo"
//   | "policeReport"
//   | "insuranceReg"
//   | "feims";
interface DocumentRequirement {
  id: number;
  country_id: number;
  permit_type: string;
  document_type: string;
  title: string;
  description: string | null;
  is_required: boolean;
  display_order: number;
  status: string;
}
interface PermitFeeTier {
  id: number;
  country_id: number;
  permit_type: string;
  age_group_label: string;
  min_age: number;
  max_age: number;
  insurance_premium_npr: string | number;
  service_fee_npr: string | number;
  ssf_contribution_npr: string | number;
  welfare_fund_npr: string | number;
  total_cost_npr: string | number;
  status: string;
}
interface FormDataType {
  name: string;
  email: string;
  passportNumber: string;
  phoneCode: string;
  phone: string;
  countryId: string;
  permitType: string;
  passportExpiryDate: string;
  adDate: string;
  bsDate: string;
  age: number | null;
  files: Record<string, File | null>;
  companyChange: boolean;
}
interface WorkPermitModalProps {
  country: CountryProps[];
  defaultCountry?: string;
  defaultPermitType?: string;
  documentRequirements?: DocumentRequirement[];
}
const WorkPermitModal = ({
  country,
  defaultCountry,
  defaultPermitType = "new_labour_permit",
  documentRequirements = [],
}: WorkPermitModalProps) => {
  const [currentStep, setCurrentStep] = useState<"stepA" | "stepB" | "stepC" | "payment" | "submitted">("stepA");
  const [applicationId, setApplicationId] = useState("");
  const [workPermitId, setWorkPermitId] = useState<number | null>(null);
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [missingDocTypes, setMissingDocTypes] = useState<Record<string, boolean>>({});
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid">("unpaid");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"esewa" | "pay_later">("esewa");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permitFeeTiers, setPermitFeeTiers] = useState<PermitFeeTier[]>([]);
  const [loadingFeeTiers, setLoadingFeeTiers] = useState(false);
  // Max selectable DOB is today (cannot be in future)
  const todayStr = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    passportNumber: "",
    phoneCode: "+977",
    phone: "",
    countryId: "",
    permitType: defaultPermitType || "new_labour_permit",
    passportExpiryDate: "",
    adDate: "",
    bsDate: "",
    age: null,
    files: {},
    companyChange: false,
  });
  // Keep permit type synced with the permit selected on the details page
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      permitType: defaultPermitType || "new_labour_permit",
    }));
  }, [defaultPermitType]);
  // Set default country
  useEffect(() => {
    if (defaultCountry && country.length > 0) {
      const matchedCountry = country.find(
        (c) => c.country_name === defaultCountry
      );
      if (matchedCountry) {
        setFormData((prev) => ({
          ...prev,
          countryId: prev.countryId || matchedCountry.id.toString(),
        }));
      }
    }
  }, [defaultCountry, country]);
useEffect(() => {
  const fetchPermitFeeTiers = async () => {
    if (!formData.countryId) {
      setPermitFeeTiers([]);
      return;
    }
    try {
      setLoadingFeeTiers(true);
      const apiPermitType = formData.permitType.toUpperCase();
      const response = await getPermitFeeTiers(
        formData.countryId,
        apiPermitType
      );
      console.log(
        "PERMIT FEE TIERS RESPONSE:",
        response.data
      );
      // API response:
      // response.data.data = paginator
      // response.data.data.data = actual fee tier array
      const tiers = response.data?.data?.data ?? [];
      console.log("ACTUAL FEE TIERS:", tiers);
      setPermitFeeTiers(
        Array.isArray(tiers) ? tiers : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch permit fee tiers:",
        error
      );
      setPermitFeeTiers([]);
    } finally {
      setLoadingFeeTiers(false);
    }
  };
  fetchPermitFeeTiers();
}, [formData.countryId, formData.permitType]);
  const filteredDocumentRequirements = documentRequirements;
  const selectedCountry = country.find(
    (c) => c.id.toString() === formData.countryId
  );
  const selectedCountryName = selectedCountry?.country_name || "";
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  // const fileFields: {
  //   key: FileKeys;
  //   label: string;
  //   required: boolean;
  //   hint: string;
  // }[] = [
  //     {
  //       key: "photo",
  //       label: "MRP Size Photo (Recent) *",
  //       required: true,
  //       hint: "Recent white background passport/MRP size photo",
  //     },
  //     {
  //       key: "passport",
  //       label: "Original Passport (Scan Copy) *",
  //       required: true,
  //       hint: "Clear scan of first (bio) & last page with signature",
  //     },
  //     {
  //       key: "visaCopy",
  //       label: "Valid Job Offer Letter/Visa Copy *",
  //       required: true,
  //       hint: "Approved entry visa or official employer job agreement",
  //     },
  //     {
  //       key: "experienceCert",
  //       label: "Experience Certificates (If Required)",
  //       required: false,
  //       hint: "Trade, technical, or prior foreign employment proof if available",
  //     },
  //     {
  //       key: "policeReport",
  //       label: "Police Clearance Report (If Required)",
  //       required: false,
  //       hint: "Police character certificate if requested by employer/embassy",
  //     },
  //     {
  //       key: "insuranceReg",
  //       label: "Insurance Registration – SSF / Welfare Fund (If Required)",
  //       required: false,
  //       hint: "Social Security Fund or Foreign Employment Welfare Fund insurance slip",
  //     },
  //     {
  //       key: "feims",
  //       label: "FEIMS Online Registration Slip (If Required)",
  //       required: false,
  //       hint: "Foreign Employment Information Management System online registration slip",
  //     },
  //   ];
  const handleButtonClick = (key: string) => {
    fileRefs.current[key]?.click();
  };
  const handleFileChange = (
    documentType: string,
    file: File | null
  ) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setStepErrors([`File "${file.name}" exceeds the maximum limit of 10MB.`]);
        return;
      }
      const allowedExt = ["jpg", "jpeg", "png", "pdf"];
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExt.includes(ext)) {
        setStepErrors([`File "${file.name}" has an unsupported format. Only JPG, PNG, and PDF are allowed.`]);
        return;
      }
    }
    // Clear missing document error for this doc
    if (missingDocTypes[documentType]) {
      setMissingDocTypes((prev) => {
        const next = { ...prev };
        delete next[documentType];
        return next;
      });
    }
    setStepErrors((prev) => prev.filter((err) => !err.toLowerCase().includes(documentType.toLowerCase())));
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [documentType]: file,
      },
    }));
  };
  const handleConvert = (value: string) => {
    if (fieldErrors.adDate) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.adDate;
        return next;
      });
    }
    if (!value) {
      setFormData((prev) => ({
        ...prev,
        adDate: "",
        bsDate: "",
        age: null,
      }));
      return;
    }
    const birthDate = new Date(value);
    const now = new Date();
    // Check if future date
    if (birthDate > now) {
      setFormData((prev) => ({
        ...prev,
        adDate: value,
        bsDate: "Invalid (Future Date)",
        age: -1,
      }));
      setFieldErrors((prev) => ({
        ...prev,
        adDate: "Date of birth cannot be in the future",
      }));
      return;
    }
    // Accurate Age Calculation
    let calculatedAge = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    if (calculatedAge < 18) {
      setFieldErrors((prev) => ({
        ...prev,
        adDate: "Applicant must be at least 18 years of age for foreign employment",
      }));
    } else if (calculatedAge > 75) {
      setFieldErrors((prev) => ({
        ...prev,
        adDate: "Applicant exceeds maximum working age limit (75 years)",
      }));
    }
    // Attempt BS conversion without throwing or wiping age
    let bs = "";
    try {
      bs = ADToBS(value);
    } catch {
      bs = "";
    }
    setFormData((prev) => ({
      ...prev,
      adDate: value,
      bsDate: bs,
      age: calculatedAge,
    }));
  };
  const getAgeCategoryText = (age: number | null): string => {
    if (age === null || isNaN(age)) return "--";
    if (age < 0) return "Invalid Date";
    const label =
      age < 18 ? "Under 18 years" :
        age <= 35 ? "Below 35 years" :
          age <= 50 ? "35–50 years" :
            "Above 51 years";
    return `${label}  ·  ${age} yrs old`;
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "passportNumber") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };
  const validateStepA = () => {
    const errors: string[] = [];
    const newFieldErrors: Record<string, string> = {};
    let firstErrorFieldId: string | null = null;

    // Full Name
    if (!formData.name.trim()) {
      const msg = "Full Name is required";
      errors.push(msg);
      newFieldErrors.name = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_name";
    } else if (formData.name.trim().length < 3) {
      const msg = "Full Name must be at least 3 characters";
      errors.push(msg);
      newFieldErrors.name = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_name";
    }

    // Email Address
    if (!formData.email.trim()) {
      const msg = "Email address is required";
      errors.push(msg);
      newFieldErrors.email = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      const msg = "Please enter a valid email address (e.g. name@example.com)";
      errors.push(msg);
      newFieldErrors.email = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_email";
    }

    // Passport Number
    if (!formData.passportNumber.trim()) {
      const msg = "Passport Number is required";
      errors.push(msg);
      newFieldErrors.passportNumber = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_passportNumber";
    } else if (!/^[A-Za-z0-9]{6,20}$/.test(formData.passportNumber.trim())) {
      const msg = "Passport Number must be 6–20 alphanumeric characters";
      errors.push(msg);
      newFieldErrors.passportNumber = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_passportNumber";
    }

    // Passport Expiry Date
    if (!formData.passportExpiryDate) {
      const msg = "Passport Expiry Date is required";
      errors.push(msg);
      newFieldErrors.passportExpiryDate = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_passportExpiryDate";
    } else {
      const expiry = new Date(formData.passportExpiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(expiry.getTime())) {
        const msg = "Please enter a valid Passport Expiry Date";
        errors.push(msg);
        newFieldErrors.passportExpiryDate = msg;
        if (!firstErrorFieldId) firstErrorFieldId = "wp_passportExpiryDate";
      } else if (expiry < today) {
        const msg = "Passport has expired. Expiry date cannot be in the past.";
        errors.push(msg);
        newFieldErrors.passportExpiryDate = msg;
        if (!firstErrorFieldId) firstErrorFieldId = "wp_passportExpiryDate";
      }
    }

    // Phone / WhatsApp Number
    const cleanPhone = formData.phone.replace(/[\s\-]/g, "");
    if (!cleanPhone) {
      const msg = "Phone / WhatsApp number is required";
      errors.push(msg);
      newFieldErrors.phone = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_phone";
    } else if (formData.phoneCode === "+977" && !/^\d{10}$/.test(cleanPhone)) {
      const msg = "Nepal mobile number must be 10 digits";
      errors.push(msg);
      newFieldErrors.phone = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_phone";
    } else if (!/^\d{6,15}$/.test(cleanPhone)) {
      const msg = "Phone must be a valid number (6–15 digits)";
      errors.push(msg);
      newFieldErrors.phone = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_phone";
    }

    // Destination Country
    if (!formData.countryId) {
      const msg = "Destination Country is required";
      errors.push(msg);
      newFieldErrors.countryId = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_countryId";
    }

    // Date of Birth
    if (!formData.adDate) {
      const msg = "Date of birth is required";
      errors.push(msg);
      newFieldErrors.adDate = msg;
      if (!firstErrorFieldId) firstErrorFieldId = "wp_adDate";
    } else {
      const dob = new Date(formData.adDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(dob.getTime())) {
        const msg = "Please enter a valid Date of Birth";
        errors.push(msg);
        newFieldErrors.adDate = msg;
        if (!firstErrorFieldId) firstErrorFieldId = "wp_adDate";
      } else if (dob > today || (formData.age !== null && formData.age < 0)) {
        const msg = "Date of birth cannot be in the future";
        errors.push(msg);
        newFieldErrors.adDate = msg;
        if (!firstErrorFieldId) firstErrorFieldId = "wp_adDate";
      } else if (formData.age !== null && formData.age < 18) {
        const msg = "Applicant must be at least 18 years of age for foreign employment";
        errors.push(msg);
        newFieldErrors.adDate = msg;
        if (!firstErrorFieldId) firstErrorFieldId = "wp_adDate";
      } else if (formData.age !== null && formData.age > 75) {
        const msg = "Applicant exceeds maximum working age limit (75 years)";
        errors.push(msg);
        newFieldErrors.adDate = msg;
        if (!firstErrorFieldId) firstErrorFieldId = "wp_adDate";
      }
    }

    setFieldErrors(newFieldErrors);
    setStepErrors(errors);
    return { isValid: errors.length === 0, firstErrorFieldId, errors };
  };
  const validateStepB = () => {
    const errors: string[] = [];
    const missingDocs: Record<string, boolean> = {};
    let firstMissingDocType: string | null = null;
    filteredDocumentRequirements.forEach((document) => {
      if (document.is_required && !formData.files[document.document_type]) {
        errors.push(`${document.title} is required`);
        missingDocs[document.document_type] = true;
        if (!firstMissingDocType) {
          firstMissingDocType = document.document_type;
        }
      }
    });
    setMissingDocTypes(missingDocs);
    setStepErrors(errors);
    return { isValid: errors.length === 0, firstMissingDocType, errors };
  };
  const goToStepB = () => {
    const result = validateStepA();
    if (result.isValid) {
      setStepErrors([]);
      setFieldErrors({});
      setCurrentStep("stepB");
    } else if (result.firstErrorFieldId) {
      setTimeout(() => {
        const el = document.getElementById(result.firstErrorFieldId!);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
    }
  };
  const goToStepC = () => {
    const result = validateStepB();
    if (result.isValid) {
      setStepErrors([]);
      setMissingDocTypes({});
      setCurrentStep("stepC");
    } else if (result.firstMissingDocType) {
      setTimeout(() => {
        const el = document.getElementById(`wp_doc_${result.firstMissingDocType}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          const btn = document.getElementById(`wp_doc_btn_${result.firstMissingDocType}`) || el.querySelector("button");
          if (btn) btn.focus();
        }
      }, 50);
    }
  };
  // ── Work Permit Fee Calculation (Age-based government & insurance fee structure) ──
const selectedFeeTier =
  formData.age !== null
    ? permitFeeTiers.find(
        (tier) =>
          formData.age! >= Number(tier.min_age) &&
          formData.age! <= Number(tier.max_age)
      )
    : undefined;
const totalFeeNpr = selectedFeeTier
  ? Number(selectedFeeTier.total_cost_npr)
  : 0;
const getFeeTierLabel = () => {
  if (!selectedFeeTier) {
    return "No fee tier available";
  }
  return selectedFeeTier.age_group_label;
};
const totalPriceFormatted = loadingFeeTiers
  ? "Loading..."
  : selectedFeeTier
    ? `NPR ${totalFeeNpr.toLocaleString("en-IN")}`
    : "NPR 0";
  // const handleSubmit = (e?: React.FormEvent) => {
  //   if (e) e.preventDefault();
  //   if (!applicationId) {
  //     const trackingCode = `TH-WP-${Math.floor(100000 + Math.random() * 900000)}`;
  //     setApplicationId(trackingCode);
  //   }
  //   setCurrentStep("payment");
  // };
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isSessionValid()) {
      clearAuthSession();
      window.location.href = `/login?from=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    // Prevent multi-processing / double submission
    if (isSubmitting) return;
    // Validate Step A before submitting
    const stepAResult = validateStepA();
    if (!stepAResult.isValid) {
      setCurrentStep("stepA");
      if (stepAResult.firstErrorFieldId) {
        setTimeout(() => {
          const el = document.getElementById(stepAResult.firstErrorFieldId!);
          if (el) {
            el.focus();
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
      return;
    }
    // Validate Step B documents before submitting
    const stepBResult = validateStepB();
    if (!stepBResult.isValid) {
      setCurrentStep("stepB");
      if (stepBResult.firstMissingDocType) {
        setTimeout(() => {
          const el = document.getElementById(`wp_doc_${stepBResult.firstMissingDocType}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            const btn = document.getElementById(`wp_doc_btn_${stepBResult.firstMissingDocType}`) || el.querySelector("button");
            if (btn) btn.focus();
          }
        }, 100);
      }
      return;
    }
    try {
      setIsSubmitting(true);
      setStepErrors([]);
      const payload = new FormData();
      // Application data
      payload.append("country_id", formData.countryId);
      payload.append(
        "permit_type",
        formData.permitType.toUpperCase()
      );
      payload.append(
        "applicant_full_name",
        formData.name
      );
      payload.append(
        "phone_number",
        `${formData.phoneCode}${formData.phone}`
      );
      payload.append("email", formData.email);
      payload.append("dob_ad", formData.adDate);
      payload.append("dob_bs", formData.bsDate);
      payload.append(
        "passport_number",
        formData.passportNumber
      );
      payload.append(
        "passport_expiry_date",
        formData.passportExpiryDate
      );
      payload.append(
        "company_changed",
        formData.companyChange ? "1" : "0"
      );
      // Documents
      filteredDocumentRequirements.forEach((document) => {
        const file =
          formData.files[document.document_type];
        if (file) {
          payload.append(
            "document_types[]",
            document.document_type
          );
          payload.append(
            "files[]",
            file
          );
        }
      });
      const response =
        await createWorkPermitApplication(payload);
      console.log(
        "WORK PERMIT CREATED:",
        response.data
      );
      const application = response.data.data;
      setWorkPermitId(application.id);
      setApplicationId(
        application.application_number
      );
      setCurrentStep("payment");
    } catch (error: any) {
      console.error(
        "Work permit submission failed:",
        error
      );
      const responseData = error?.response?.data;
      if (responseData?.errors) {
        const validationErrors = Object.values(
          responseData.errors
        ).flat() as string[];
        setStepErrors(validationErrors);
        // Redirect to invalid field if backend points to one
        const errKeys = Object.keys(responseData.errors);
        const stepAFieldMap: Record<string, string> = {
          applicant_full_name: "wp_name",
          name: "wp_name",
          email: "wp_email",
          passport_number: "wp_passportNumber",
          passport_expiry_date: "wp_passportExpiryDate",
          phone_number: "wp_phone",
          phone: "wp_phone",
          country_id: "wp_countryId",
          dob_ad: "wp_adDate",
          dob_bs: "wp_adDate",
        };
        const matchingStepAKey = errKeys.find((k) => stepAFieldMap[k]);
        if (matchingStepAKey) {
          setCurrentStep("stepA");
          setTimeout(() => {
            const el = document.getElementById(stepAFieldMap[matchingStepAKey]);
            if (el) {
              el.focus();
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        } else if (errKeys.some((k) => k.includes("document") || k.includes("file"))) {
          setCurrentStep("stepB");
          setTimeout(() => {
            const docContainer = document.querySelector('[id^="wp_doc_"]');
            if (docContainer) {
              docContainer.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        }
      } else {
        setStepErrors([
          responseData?.message ||
          "Failed to submit work permit application.",
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  // ── eSewa mock payment handler ──
  const handleEsewaPayment = async () => {
    if (!workPermitId) {
      setStepErrors([
        "Work permit application ID not found.",
      ]);
      return;
    }
    try {
      setIsProcessingPayment(true);
      setStepErrors([]);
      // 1. Create PENDING payment and get eSewa payment data
      const response = await initiatePayment({
        work_permit_id: workPermitId,
        provider: "ESEWA",
      });
      console.log(
        "ESEWA INITIATE RESPONSE:",
        response.data
      );
      const paymentData = response.data?.data;
      if (!response.data?.status || !paymentData) {
        throw new Error(
          response.data?.message ||
          "Failed to initiate eSewa payment."
        );
      }
      if (!paymentData.payment_url) {
        throw new Error(
          "eSewa payment URL was not returned."
        );
      }
      // 2. Create form for eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentData.payment_url;
      // 3. Exact fields returned by your Laravel backend
      const fields = {
        amount: paymentData.amount,
        tax_amount: paymentData.tax_amount,
        total_amount: paymentData.total_amount,
        transaction_uuid:
          paymentData.transaction_uuid,
        product_code: paymentData.product_code,
        product_service_charge:
          paymentData.product_service_charge,
        product_delivery_charge:
          paymentData.product_delivery_charge,
        success_url: paymentData.success_url,
        failure_url: paymentData.failure_url,
        signed_field_names:
          paymentData.signed_field_names,
        signature: paymentData.signature,
      };
      // 4. Convert fields into hidden form inputs
      Object.entries(fields).forEach(
        ([name, value]) => {
          const input =
            document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = String(value);
          form.appendChild(input);
        }
      );
      // 5. Add form to DOM
      document.body.appendChild(form);
      // 6. Submit directly to eSewa
      form.submit();
    } catch (error: any) {
      console.error(
        "eSewa payment initiation failed:",
        error
      );
      setStepErrors([
        error?.response?.data?.message ||
        error?.message ||
        "Failed to initiate eSewa payment.",
      ]);
      setIsProcessingPayment(false);
    }
  };
  // ── Pay Later handler ──
  const handlePayLater = async () => {
    try {
      setIsProcessingPayment(true);
      setStepErrors([]);
      if (workPermitId) {
        try {
          await initiatePayment({
            work_permit_id: workPermitId,
            provider: "PAYLATER",
          });
        } catch (apiErr) {
          console.warn("Pay later backend initiate warning:", apiErr);
        }
      }
      setSelectedPaymentMethod("pay_later");
      setPaymentStatus("unpaid");
      setCurrentStep("submitted");
    } catch (error: any) {
      console.error("Pay later initiation failed:", error);
      setSelectedPaymentMethod("pay_later");
      setPaymentStatus("unpaid");
      setCurrentStep("submitted");
    } finally {
      setIsProcessingPayment(false);
    }
  };
  const handleDownloadSlip = () => {
    const submittedAt = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const permitTypeLabel = ({
      new_labour_permit: "New Labour Permit (Shram)",
      renewal_permit: "Renewal Permit",
      individual_permit: "Individual Work Permit",
    } as Record<string, string>)[formData.permitType] ?? formData.permitType.replace(/_/g, " ");
    // ── Build full-page printable slip ──
    const paymentMethodLabel = selectedPaymentMethod === "esewa" ? "&#128178; eSewa Digital Wallet" : "&#128203; Pay Later (Pay at Office)";
    const amountPaid = paymentStatus === "paid" ? totalPriceFormatted : "NPR 0.00 (Pending)";
    const balanceDue = paymentStatus === "paid" ? "NPR 0.00 (Cleared)" : totalPriceFormatted;
    const payStatusClass = paymentStatus === "paid" ? "status-paid" : "status-unpaid";
    const payStatusText = paymentStatus === "paid" ? "&#10003; PAID" : "&#9888; UNPAID";
    const payCardClass = paymentStatus === "paid" ? "green" : "amber";
    const txNote = paymentStatus === "paid"
      ? "Payment received via eSewa. Verification in progress."
      : "Payment pending. Please complete payment at the office or via eSewa before processing begins.";
    const docRows = filteredDocumentRequirements.map((document) => {
      const hasFile = !!formData.files[document.document_type];
      const isRequired = document.is_required;
      let statusCell: string;
      if (hasFile) {
        statusCell = '<span style="display:inline-block;padding:2px 7px;background:#D1FAE5;color:#047857;border:1px solid #6EE7B7;border-radius:3px;font-size:7.8px;font-weight:800;text-transform:uppercase;letter-spacing:0.3px;">&#10003; Uploaded</span>';
      } else if (isRequired) {
        statusCell = '<span style="display:inline-block;padding:2px 7px;background:#FEE2E2;color:#DC2626;border:1px solid #FCA5A5;border-radius:3px;font-size:7.8px;font-weight:800;text-transform:uppercase;letter-spacing:0.3px;">&#10007; Missing</span>';
      } else {
        statusCell = '<span style="color:#9ca3af;font-size:8px;font-style:italic;">&#8212; Not provided</span>';
      }
      const reqStar = isRequired ? ' <span style="color:#e11d48;">*</span>' : '';
      return `<tr><td class="td-label">${document.title}${reqStar}</td><td class="td-val" style="text-align:center;">${statusCell}</td></tr>`;
    }).join("");
    const emptyDocs = filteredDocumentRequirements.length === 0
      ? '<tr><td class="td-val" colspan="2" style="text-align:center;color:#9ca3af;font-style:italic;font-size:8.5px;">No documents required</td></tr>'
      : '';
    const slipHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Work_Permit_Slip_${applicationId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          @page { size: A4 portrait; margin: 6mm 8mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { font-family: 'Inter', Arial, sans-serif; background: #fff; color: #111; font-size: 8.8px; line-height: 1.35; }
          .page { width: 100%; max-width: 195mm; margin: 0 auto; padding: 0; display: flex; flex-direction: column; gap: 0; page-break-inside: avoid !important; break-inside: avoid !important; }
          /* watermark */
          .wm-wrap { position:fixed; top:0; left:0; right:0; bottom:0; display:flex; align-items:center; justify-content:center; pointer-events:none; user-select:none; z-index:999; }
          .wm { transform:rotate(-28deg); font-size:36px; font-weight:900; color:rgba(0,0,0,0.035); text-transform:uppercase; letter-spacing:0.05em; white-space:nowrap; }
          /* letterhead */
          .lh { display:flex; align-items:center; justify-content:space-between; padding-bottom:5px; border-bottom:1.5px solid #200B3B; margin-bottom:5px; }
          .lh-left { display:flex; align-items:center; gap:9px; }
          .logo { height:42px; width:auto; object-fit:contain; }
          .co-name { font-size:13px; font-weight:900; color:#200B3B; line-height:1.1; }
          .co-tag { font-size:8.5px; color:#4B1E7A; font-weight:600; margin-top:1.5px; }
          .co-contact { font-size:7.5px; color:#555; margin-top:1.5px; }
          .lh-right { text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:2px; }
          .badge { display:inline-block; background:#200B3B; color:#fff; font-size:8px; font-weight:800; text-transform:uppercase; letter-spacing:0.7px; padding:2.5px 7px; border-radius:3px; }
          .slip-date { font-size:8px; color:#555; }
          /* title band */
          .title-band { background:linear-gradient(135deg,#200B3B 0%,#4B1E7A 100%); color:#fff; padding:5px 10px; margin-bottom:5px; display:flex; justify-content:space-between; align-items:center; border-radius:3px; }
          .title-band h1 { font-size:11px; font-weight:900; letter-spacing:0.3px; text-transform:uppercase; }
          .title-band .dest { font-size:8.5px; color:#D8C4F5; font-weight:600; margin-top:1px; }
          .title-band .doc-id { text-align:right; }
          .title-band .doc-id-label { font-size:7.5px; color:#C4ADE8; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
          .title-band .doc-id-val { font-family:'Courier New',monospace; font-size:11.5px; font-weight:700; color:#fff; letter-spacing:0.7px; }
          /* ref box */
          .ref-box { display:flex; align-items:stretch; border:1px solid #9B6FD4; border-radius:3px; overflow:hidden; margin-bottom:5px; background:#FAF6FF; }
          .ref-accent { width:4px; background:linear-gradient(180deg,#200B3B 0%,#9B6FD4 100%); flex-shrink:0; }
          .ref-content { flex:1; padding:3.5px 10px; display:flex; justify-content:space-between; align-items:center; gap:10px; }
          .ref-lbl { font-size:7.8px; font-weight:800; color:#4B1E7A; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:1px; }
          .ref-val { font-family:'Courier New',monospace; font-size:11.5px; font-weight:800; color:#200B3B; letter-spacing:0.7px; }
          .ref-meta { text-align:right; }
          .ref-meta-lbl { font-size:7.2px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#666; }
          .ref-meta-val { font-size:9px; font-weight:800; margin-top:1px; }
          /* section heading */
          .sh { display:flex; align-items:center; gap:5px; margin-bottom:2.5px; margin-top:4.5px; }
          .sh-line { flex:1; height:1px; background:linear-gradient(90deg,#200B3B 0%,#C4ADE8 100%); }
          .sh-text { font-size:8px; font-weight:900; color:#200B3B; text-transform:uppercase; letter-spacing:0.6px; white-space:nowrap; background:#EDE5F8; padding:2px 7px; border-radius:2.5px; }
          /* table */
          .tbl { width:100%; border-collapse:collapse; border:1px solid #9B6FD4; }
          .tbl th { padding:2.8px 6px; border:1px solid #6B3FA0; text-align:left; vertical-align:middle; font-size:8px; font-weight:900; text-transform:uppercase; letter-spacing:0.3px; background:#200B3B; color:#fff; }
          .tbl td { padding:2.8px 6px; border:1px solid #D8C4F5; vertical-align:middle; line-height:1.3; font-size:8.4px; }
          .tbl tbody tr:nth-child(even) td { background:#F8F4FF; }
          .tbl tbody tr:nth-child(odd) td { background:#fff; }
          .td-label { font-size:7.8px; font-weight:700; color:#4B1E7A; text-transform:uppercase; letter-spacing:0.3px; background:#EDE5F8 !important; border-right:1px solid #9B6FD4 !important; }
          .td-val { font-size:8.4px; font-weight:600; color:#1A0B2E; }
          .td-val.bold { font-weight:800; color:#200B3B; }
          .td-val.mono { font-family:'Courier New',monospace; letter-spacing:0.2px; }
          .td-val.fee { font-size:9.5px; font-weight:900; }
          /* payment cards */
          .pay-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; margin-top:2.5px; margin-bottom:3.5px; }
          .pay-card { border:1px solid #D8C4F5; border-radius:3px; padding:4px 8px; background:#FAF6FF; }
          .pay-card-lbl { font-size:7.5px; font-weight:800; color:#4B1E7A; text-transform:uppercase; letter-spacing:0.3px; margin-bottom:1px; }
          .pay-card-val { font-size:10.5px; font-weight:900; color:#200B3B; }
          .pay-card-val.green { color:#047857; }
          .pay-card-val.amber { color:#B45309; }
          /* status badges */
          .status-badge { display:inline-block; padding:2px 6px; border-radius:2.5px; font-size:7.8px; font-weight:900; text-transform:uppercase; letter-spacing:0.3px; }
          .status-paid { background:#D1FAE5; color:#047857; border:1px solid #6EE7B7; }
          .status-unpaid { background:#FEF3C7; color:#B45309; border:1px solid #FCD34D; }
          .status-pending { background:#DBEAFE; color:#1D4ED8; border:1px solid #93C5FD; }
          /* two col */
          .two-col { display:grid; grid-template-columns:1fr 1fr; gap:7px; align-items:start; }
          .two-col .col-blk { display:flex; flex-direction:column; }
          .two-col .sh { margin-top:0; }
          /* notice */
          .notice { border-left:3px solid #9B6FD4; background:#FAF6FF; border-radius:0 3px 3px 0; padding:5px 9px; font-size:7.8px; color:#1A0B2E; line-height:1.4; }
          .notice strong { color:#200B3B; }
          /* checklist */
          .cl-box { border:1px solid #D8C4F5; border-radius:3px; padding:5px 9px; background:#FAF6FF; }
          .cl-title { font-size:8px; font-weight:900; color:#200B3B; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2.5px; border-bottom:1px solid #D8C4F5; padding-bottom:1.5px; }
          .cl-grid { display:grid; grid-template-columns:1fr 1fr; gap:2px 9px; }
          .cl-item { display:flex; align-items:flex-start; gap:3px; font-size:7.6px; color:#374151; line-height:1.35; }
          .ci { color:#047857; font-weight:900; font-size:9px; flex-shrink:0; margin-top:0; }
          /* signature */
          .sig-block { display:flex; justify-content:space-between; margin-top:14px; padding-top:6px; border-top:1px dashed #9B6FD4; }
          .sig-col { text-align:center; min-width:95px; }
          .sig-line { border-top:1px solid #000; margin:18px auto 3px auto; width:95px; }
          .sig-lbl { font-size:8px; color:#555; font-weight:600; text-transform:uppercase; letter-spacing:0.4px; }
          .sig-name { font-size:8px; color:#777; margin-top:1px; }
          /* footer */
          .footer { margin-top:8px; padding-top:4px; border-top:1.2px solid #200B3B; display:flex; justify-content:space-between; align-items:flex-start; font-size:7.2px; color:#555; }
          .footer-l { line-height:1.4; }
          .footer-r { text-align:right; line-height:1.4; }
          @media print {
            @page { size: A4 portrait; margin: 6mm 8mm; }
            html, body { width: 100% !important; height: auto !important; margin: 0 !important; padding: 0 !important; }
            .page { width: 100% !important; max-width: 100% !important; height: auto !important; margin: 0 !important; padding: 0 !important; page-break-inside: avoid !important; break-inside: avoid !important; page-break-after: avoid !important; break-after: avoid !important; }
            * { page-break-inside: avoid !important; break-inside: avoid !important; }
          }
        </style>
      </head>
      <body>
        <div class="page">

          <!-- WATERMARK -->
          <div class="wm-wrap"><div class="wm">Trip Himalaya Tours and Travels</div></div>

          <!-- LETTERHEAD -->
          <div class="lh">
            <div class="lh-left">
              <img src="${THTTLogo}" class="logo" alt="THTT" />
              <div>
                <div class="co-name">Trip Himalaya Tours &amp; Travels Pvt. Ltd.</div>
                <div class="co-tag">Govt. Approved Travel &amp; Foreign Employment Documentation Agency</div>
                <div class="co-contact">Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal &nbsp;|&nbsp; +977-9851403761 &nbsp;|&nbsp; dev.triphimalayatt@gmail.com &nbsp;|&nbsp; www.triphimalaya.com.np</div>
              </div>
            </div>
            <div class="lh-right">
              <div class="badge">&#10003; Official Document</div>
              <div class="slip-date">Issued: ${submittedAt}</div>
            </div>
          </div>

          <!-- TITLE BAND -->
          <div class="title-band">
            <div>
              <h1>Work Permit (Shram Swikriti) Application Slip</h1>
              <div class="dest">Destination: ${selectedCountryName || "Nepal"} &nbsp;/&nbsp; ${permitTypeLabel}</div>
            </div>
            <div class="doc-id">
              <div class="doc-id-label">Reference Number</div>
              <div class="doc-id-val">${applicationId}</div>
            </div>
          </div>

          <!-- REFERENCE + STATUS -->
          <div class="ref-box">
            <div class="ref-accent"></div>
            <div class="ref-content">
              <div>
                <div class="ref-lbl">Official Submission Reference</div>
                <div class="ref-val">${applicationId}</div>
              </div>
              <div class="ref-meta">
                <div class="ref-meta-lbl">Application Status</div>
                <div class="ref-meta-val" style="color:#047857;">&#10003; SUBMITTED</div>
              </div>
              <div class="ref-meta">
                <div class="ref-meta-lbl">Submitted On</div>
                <div class="ref-meta-val" style="font-size:7px; color:#374151; font-weight:700;">${submittedAt}</div>
              </div>
            </div>
          </div>

          <!-- TWO-COLUMN: APPLICANT + DOCUMENTS -->
          <div class="two-col">
            <!-- APPLICANT DETAILS -->
            <div class="col-blk">
              <div class="sh">
                <div class="sh-text">&#128100; Applicant Details</div>
                <div class="sh-line"></div>
              </div>
              <table class="tbl">
                <thead><tr><th style="width:44%;">Field</th><th>Information</th></tr></thead>
                <tbody>
                  <tr><td class="td-label">Full Name</td><td class="td-val bold">${formData.name || "—"}</td></tr>
                  <tr><td class="td-label">Email Address</td><td class="td-val">${formData.email || "—"}</td></tr>
                  <tr><td class="td-label">Passport Number</td><td class="td-val mono bold">${formData.passportNumber ? formData.passportNumber.toUpperCase() : "—"}</td></tr>
                  <tr><td class="td-label">Passport Expiry</td><td class="td-val mono">${formData.passportExpiryDate || "—"}</td></tr>
                  <tr><td class="td-label">Phone / WhatsApp</td><td class="td-val bold">${formData.phoneCode} ${formData.phone || "—"}</td></tr>
                  <tr><td class="td-label">Date of Birth (A.D.)</td><td class="td-val mono">${formData.adDate || "—"}</td></tr>
                  <tr><td class="td-label">Date of Birth (B.S.)</td><td class="td-val mono">${formData.bsDate || "—"}</td></tr>
                  <tr><td class="td-label">Age / Category</td><td class="td-val">${formData.age !== null ? getFeeTierLabel() + " " + formData.age + " yrs" : "—"}</td></tr>
                  <tr><td class="td-label">Destination Country</td><td class="td-val bold">${selectedCountryName || "—"}</td></tr>
                  <tr><td class="td-label">Permit Type</td><td class="td-val">${permitTypeLabel}</td></tr>
                  <tr><td class="td-label">Company Transfer</td><td class="td-val">${formData.companyChange ? "&#10003; Yes" : "&#10007; No"}</td></tr>
                </tbody>
              </table>
            </div>

            <!-- SUBMITTED DOCUMENTS -->
            <div class="col-blk">
              <div class="sh">
                <div class="sh-text">&#128196; Submitted Documents</div>
                <div class="sh-line"></div>
              </div>
              <table class="tbl">
                <thead><tr><th style="width:58%;">Document</th><th>Status</th></tr></thead>
                <tbody>${docRows}${emptyDocs}</tbody>
              </table>
            </div>
          </div>

          <!-- PAYMENT SECTION -->
          <div class="sh">
            <div class="sh-text">&#128179; Payment Information</div>
            <div class="sh-line"></div>
          </div>

          <!-- 3-card summary -->
          <div class="pay-grid">
            <div class="pay-card">
              <div class="pay-card-lbl">&#128181; Total Processing Fee</div>
              <div class="pay-card-val">${totalPriceFormatted}</div>
            </div>
            <div class="pay-card">
              <div class="pay-card-lbl">&#128179; Amount Paid</div>
              <div class="pay-card-val ${payCardClass}">${amountPaid}</div>
            </div>
            <div class="pay-card">
              <div class="pay-card-lbl">&#9989; Payment Status</div>
              <div class="pay-card-val ${payCardClass}">${paymentStatus === "paid" ? "PAID" : "PENDING"}</div>
            </div>
          </div>

          <!-- Full payment table (compact 4-column key-value layout) -->
          <table class="tbl" style="margin-top:2px;">
            <tbody>
              <tr>
                <td class="td-label" style="width:20%;">Payment Method</td>
                <td class="td-val bold" style="width:30%;">${paymentMethodLabel}</td>
                <td class="td-label" style="width:20%;">Total Service Fee</td>
                <td class="td-val fee" style="width:30%;">${totalPriceFormatted}</td>
              </tr>
              <tr>
                <td class="td-label">Amount Paid</td>
                <td class="td-val fee" style="color:${paymentStatus === "paid" ? "#047857" : "#b45309"}">${amountPaid}</td>
                <td class="td-label">Balance Due</td>
                <td class="td-val fee" style="color:${paymentStatus === "paid" ? "#047857" : "#b45309"}">${balanceDue}</td>
              </tr>
              <tr>
                <td class="td-label">Payment Status</td>
                <td class="td-val"><span class="status-badge ${payStatusClass}">${payStatusText}</span></td>
                <td class="td-label">Verification</td>
                <td class="td-val"><span class="status-badge status-pending">&#128270; UNDER REVIEW</span></td>
              </tr>
              <tr>
                <td class="td-label">Transaction Note</td>
                <td class="td-val" colspan="3" style="font-size:6.5px; color:#555;">${txNote}</td>
              </tr>
            </tbody>
          </table>

          <!-- TWO-COLUMN: NOTICE + CHECKLIST -->
          <div class="two-col" style="margin-top:2.5px;">
            <!-- NEXT STEPS NOTICE -->
            <div class="notice">
              <strong>&#128276; What Happens Next:</strong> Our licensed documentation officer will review your application and contact you within <strong>24 hours</strong> via WhatsApp (<strong>${formData.phoneCode} ${formData.phone}</strong>) or phone to verify your credentials and guide you through the DoFE / FEIMS submission process. Keep Reference No. <strong>${applicationId}</strong> for all follow-ups.
            </div>

            <!-- FEO CHECKLIST -->
            <div class="cl-box">
              <div class="cl-title">&#9745; Foreign Employment Office (FEO) &ndash; Document Checklist</div>
              <div class="cl-grid">
                <div class="cl-item"><span class="ci">&#10003;</span> Original Passport (valid, not expired)</div>
                <div class="cl-item"><span class="ci">&#10003;</span> Valid Job Offer / Demand Letter</div>
                <div class="cl-item"><span class="ci">&#10003;</span> MRP Size Photograph (white background)</div>
                <div class="cl-item"><span class="ci">&#10003;</span> Insurance Registration (SSF / Welfare Fund)</div>
                <div class="cl-item"><span class="ci">&#10003;</span> FEIMS Online Registration Slip</div>
                <div class="cl-item"><span class="ci">&#10003;</span> Police Clearance (if required by employer)</div>
                <div class="cl-item"><span class="ci">&#10003;</span> GAMCA Medical Fitness Report</div>
                <div class="cl-item"><span class="ci">&#10003;</span> Pre-Departure Orientation Certificate</div>
              </div>
            </div>
          </div>

          <!-- SIGNATURE BLOCK -->
          <div class="sig-block">
            <div class="sig-col">
              <div class="sig-line"></div>
              <div class="sig-lbl">Applicant Signature</div>
              <div class="sig-name">${formData.name || "_______________"}</div>
            </div>
            <div class="sig-col">
              <div class="sig-line"></div>
              <div class="sig-lbl">Documentation Officer</div>
              <div class="sig-name">Trip Himalaya Tours &amp; Travels</div>
            </div>
            <div class="sig-col">
              <div class="sig-line"></div>
              <div class="sig-lbl">Official Stamp</div>
              <div class="sig-name">Company Seal</div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="footer">
            <div class="footer-l">
              &#9888; System-generated slip &mdash; valid without physical signature unless stamped.<br>
              &#128222; +977-9851403761 &nbsp;|&nbsp; &#9993; dev.triphimalayatt@gmail.com &nbsp;|&nbsp; &#127760; www.triphimalaya.com.np
            </div>
            <div class="footer-r">
              <strong>Trip Himalaya Tours &amp; Travels Pvt. Ltd.</strong><br>
              Ref: ${applicationId} &nbsp;|&nbsp; ${submittedAt}
            </div>
          </div>

        </div>
      </body>
      </html>
    `;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(slipHtml);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1200);
      }, 350);
    } else {
      window.print();
    }
  };
  const handleCloseModal = () => {
    const modal = document.getElementById(
      "work_permit_modal"
    ) as HTMLDialogElement;
    modal?.close();
    setTimeout(() => {
      setCurrentStep("stepA");
      setStepErrors([]);
      setPaymentStatus("unpaid");
      setSelectedPaymentMethod("esewa");
      setIsProcessingPayment(false);
      // Reset application identifiers
      setApplicationId("");
      setWorkPermitId(null);
      // Reset uploaded files
      setFormData((prev) => ({
        ...prev,
        files: {},
      }));
    }, 300);
  };
  return (
    <dialog id="work_permit_modal" className="modal w-full">
      <div className="modal-box rounded-3xl max-w-2xl p-0 overflow-hidden bg-white shadow-2xl border border-gray-100">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#2D1347] to-purple-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/80 text-[10px] font-black uppercase tracking-wider text-white">
                  Work Permit Online Portal
                </span>
                <span className="text-gray-300 text-xs font-semibold">
                  Fast Shram Processing
                </span>
              </div>
              <h2 className="font-extrabold text-xl sm:text-2xl text-white">
                {currentStep === "payment" ? "Payment Method" : "Online Application"}
              </h2>
              {currentStep === "payment" && (
                <p className="text-xs text-gray-200 mt-1">
                  Work Permit — {selectedCountryName || "Government Shram"}
                </p>
              )}
            </div>
            <button
              onClick={handleCloseModal}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          {/* 3-Step Wizard Breadcrumbs (Only if not submitted and not in payment) */}
          {currentStep !== "submitted" && currentStep !== "payment" && (
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/15">
              {/* Step A */}
              <div
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${currentStep === "stepA"
                  ? "bg-pink-600/90 text-white shadow-sm"
                  : "bg-white/10 text-gray-300"
                  }`}
              >
                <span className="w-5 h-5 rounded-full bg-white text-[#2D1347] text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  A
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold truncate">Basic Info</p>
                  <p className="text-[9px] text-pink-200 truncate">~30 sec form</p>
                </div>
              </div>
              {/* Step B */}
              <div
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${currentStep === "stepB"
                  ? "bg-pink-600/90 text-white shadow-sm"
                  : "bg-white/10 text-gray-300"
                  }`}
              >
                <span className="w-5 h-5 rounded-full bg-white text-[#2D1347] text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  B
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold truncate">Documents</p>
                  <p className="text-[9px] text-gray-300 truncate">{documentRequirements.length} Verification Files</p>
                </div>
              </div>
              {/* Step C */}
              <div
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${currentStep === "stepC"
                  ? "bg-pink-600/90 text-white shadow-sm"
                  : "bg-white/10 text-gray-300"
                  }`}
              >
                <span className="w-5 h-5 rounded-full bg-white text-[#2D1347] text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  C
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold truncate">Review</p>
                  <p className="text-[9px] text-gray-300 truncate">Final Submit</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* Error alerts if any */}
          {stepErrors.length > 0 && (
            <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Please check the following:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {stepErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* ══════════ STEP A: BASIC INFORMATION ══════════ */}
          {currentStep === "stepA" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                  <FileText size={16} className="text-pink-500" />
                  <span>STEP A: BASIC INFORMATION</span>
                </h3>
                <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1">
                  <Clock size={12} />
                  Takes ~30 seconds
                </span>
              </div>
              {/* Name */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Full Name (As in Passport)*</label>
                <input
                  id="wp_name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ram Bahadur Thapa"
                  className={`input w-full mt-1 border rounded-xl px-3 py-2 text-sm transition-colors ${
                    fieldErrors.name
                      ? "border-red-500 focus:border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-200"
                      : "border-gray-200 focus:border-pink-500"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-600 font-bold">
                  Email Address*
                </label>
                <input
                  id="wp_email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. ram@gmail.com"
                  className={`input w-full mt-1 border rounded-xl px-3 py-2 text-sm transition-colors ${
                    fieldErrors.email
                      ? "border-red-500 focus:border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-200"
                      : "border-gray-200 focus:border-pink-500"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>
              {/* Passport Number */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Passport Number*</label>
                <input
                  id="wp_passportNumber"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  placeholder="e.g. A1234567"
                  className={`input w-full mt-1 border rounded-xl px-3 py-2 text-sm transition-colors ${
                    fieldErrors.passportNumber
                      ? "border-red-500 focus:border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-200"
                      : "border-gray-200 focus:border-pink-500"
                  }`}
                  style={{ textTransform: "uppercase" }}
                />
                {fieldErrors.passportNumber && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    {fieldErrors.passportNumber}
                  </p>
                )}
              </div>
              {/* Passport Expiry Date */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Passport Expiry Date*</label>
                <input
                  id="wp_passportExpiryDate"
                  type="date"
                  name="passport_expiry_date"
                  min={todayStr}
                  value={formData.passportExpiryDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({ ...prev, passportExpiryDate: val }));
                    if (fieldErrors.passportExpiryDate) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.passportExpiryDate;
                        return next;
                      });
                    }
                  }}
                  className={`input w-full mt-1 border rounded-xl px-3 py-2 text-sm transition-colors ${
                    fieldErrors.passportExpiryDate
                      ? "border-red-500 focus:border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-200"
                      : "border-gray-200 focus:border-pink-500"
                  }`}
                />
                {fieldErrors.passportExpiryDate && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    {fieldErrors.passportExpiryDate}
                  </p>
                )}
              </div>
              {/* Phone with Country Code */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Phone / WhatsApp Number*</label>
                <div className={`flex items-stretch border rounded-xl bg-white focus-within:ring-2 transition-all overflow-hidden mt-1 ${
                  fieldErrors.phone
                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                    : "border-gray-200 focus-within:border-pink-500 focus-within:ring-pink-100"
                }`}>
                  <select
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, phoneCode: e.target.value }));
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.phone;
                          return next;
                        });
                      }
                    }}
                    className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-2 py-2 text-xs font-bold text-[#200B3B] focus:outline-none cursor-pointer"
                    style={{ maxWidth: "110px" }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.iso} value={c.code}>
                        {isoToFlag(c.iso)} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="wp_phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={formData.phoneCode === "+977" ? "98XXXXXXXX" : "Mobile / WhatsApp"}
                    className="flex-1 min-w-0 px-3 py-2 bg-white text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none"
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>
              {/* DOB & BS Conversion */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Date of Birth*</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">English (A.D.)</span>
                    <input
                      id="wp_adDate"
                      type="date"
                      max={todayStr}
                      value={formData.adDate}
                      onChange={(e) => handleConvert(e.target.value)}
                      className={`input w-full border rounded-xl px-3 py-2 text-sm mt-0.5 transition-colors ${
                        fieldErrors.adDate
                          ? "border-red-500 focus:border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-200"
                          : "border-gray-200 focus:border-pink-500"
                      }`}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Nepali (B.S.) Auto-Calculated</span>
                    <input
                      value={formData.bsDate}
                      readOnly
                      placeholder="e.g. 2055-02-14"
                      className="input w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 mt-0.5"
                    />
                  </div>
                </div>
                {fieldErrors.adDate && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    {fieldErrors.adDate}
                  </p>
                )}
              </div>
              {/* Age Category */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Age Category</label>
                <input
                  value={getAgeCategoryText(formData.age)}
                  readOnly
                  className={`input w-full border rounded-xl px-3 py-2 text-sm font-bold mt-1 ${formData.age !== null && (formData.age < 18 || formData.age < 0)
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-gray-50 border-gray-200 text-[#4a1c8c]"
                    }`}
                />
                {formData.age !== null && formData.age >= 0 && formData.age < 18 && (
                  <div className="flex items-start gap-1.5 mt-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertCircle size={13} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-red-600 font-semibold">
                      Age must be at least 18 years for foreign employment. Applicants under 18 are not eligible.
                    </span>
                  </div>
                )}
              </div>
              {/* Country & Permit Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 font-bold">Destination Country*</label>
                  <select
                    id="wp_countryId"
                    name="countryId"
                    value={formData.countryId}
                    onChange={handleChange}
                    className={`select w-full border rounded-xl px-3 py-2 text-sm mt-1 cursor-pointer transition-colors ${
                      fieldErrors.countryId
                        ? "border-red-500 focus:border-red-500 bg-red-50/20"
                        : "border-gray-200 focus:border-pink-500"
                    }`}
                  >
                    <option value="">Select Destination</option>
                    {country.map((c) => (
                      <option key={c.id} value={c.id.toString()}>
                        {c.country_name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.countryId && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" />
                      {fieldErrors.countryId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-600 font-bold">Permit Service Type</label>
                  <select
                    name="permitType"
                    value={formData.permitType}
                    onChange={handleChange}
                    className="select w-full border border-gray-200 focus:border-pink-500 rounded-xl px-3 py-2 text-sm mt-1 cursor-pointer"
                  >
                    <option value="new_labour_permit">New Labour Permit (Shram)</option>
                    <option value="renewal_permit">Renewal Permit</option>
                    <option value="individual_permit">Individual Work Permit</option>
                  </select>
                </div>
              </div>
              {/* Button to Next Step */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={goToStepB}
                  className="rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm w-full py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-pink-300/40 transition-all cursor-pointer"
                >
                  <span>PROCEED TO DOCUMENT UPLOAD</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
          {/* ══════════ STEP B: DOCUMENT UPLOAD ══════════ */}
          {currentStep === "stepB" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                  <Upload size={16} className="text-pink-500" />
                  <span>STEP B: DOCUMENT UPLOAD</span>
                </h3>
                <span className="text-[11px] text-gray-400 font-semibold">
                  JPG, PNG, or PDF (Max 10MB)
                </span>
              </div>
              {/* Document upload cards - 5 files matching page specifications */}
              {filteredDocumentRequirements.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No document requirements found for this permit type.
                </div>
              ) : (
                filteredDocumentRequirements.map((document) => {
                  const isMissing = !!missingDocTypes[document.document_type];
                  const file = formData.files[document.document_type];
                  return (
                    <div
                      key={document.id}
                      id={`wp_doc_${document.document_type}`}
                      className={`rounded-2xl p-4 border transition-all ${
                        isMissing
                          ? "bg-red-50/40 border-red-400 ring-1 ring-red-200"
                          : "bg-gray-50 border-gray-100 hover:border-pink-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label className="text-xs text-gray-800 font-bold block">
                          {document.title}
                          {document.is_required && (
                            <span className="text-pink-500 ml-1">*</span>
                          )}
                        </label>
                        {document.is_required ? (
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                              isMissing
                                ? "text-red-700 bg-red-100 border-red-300"
                                : "text-pink-600 bg-pink-50 border-pink-100"
                            }`}
                          >
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            Optional
                          </span>
                        )}
                      </div>
                      {document.description && (
                        <p className="text-[10px] text-gray-500 mb-2.5 leading-relaxed">
                          {document.description}
                        </p>
                      )}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        ref={(el) => {
                          fileRefs.current[document.document_type] = el;
                        }}
                        onChange={(e) =>
                          handleFileChange(
                            document.document_type,
                            e.target.files?.[0] || null
                          )
                        }
                      />
                      <div className="flex items-center gap-3">
                        <button
                          id={`wp_doc_btn_${document.document_type}`}
                          type="button"
                          onClick={() =>
                            handleButtonClick(document.document_type)
                          }
                          className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold text-white transition-colors shadow-xs ${
                            isMissing
                              ? "bg-red-600 hover:bg-red-700 ring-2 ring-red-200"
                              : "bg-pink-600 hover:bg-pink-700"
                          }`}
                        >
                          Choose File
                        </button>
                        {file ? (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 truncate">
                            <CheckCircle2
                              size={14}
                              className="text-emerald-600 flex-shrink-0"
                            />
                            <span className="truncate">
                              {file.name}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No file selected yet
                          </span>
                        )}
                      </div>
                      {isMissing && (
                        <p className="text-red-500 text-[11px] font-semibold mt-2.5 flex items-center gap-1">
                          <AlertCircle size={12} className="shrink-0" />
                          <span>This document is required. Please upload a file (JPG, PNG, or PDF).</span>
                        </p>
                      )}
                    </div>
                  );
                })
              )}
              {/* Optional Company Change Checkbox */}
              <div className="rounded-2xl bg-purple-50/70 p-4 border border-purple-100">
                <label className="flex items-center gap-2 text-xs font-bold text-purple-950 cursor-pointer">
                  <input
                    type="checkbox"
                    name="companyChange"
                    checked={formData.companyChange}
                    onChange={handleChange}
                    className="checkbox checkbox-sm checkbox-primary rounded-md"
                  />
                  <span>This application involves a Company Change / Transfer</span>
                </label>
              </div>
              {/* Navigation buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("stepA")}
                  className="w-1/3 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={goToStepC}
                  className="w-2/3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-pink-300/40 transition-all cursor-pointer"
                >
                  <span>REVIEW APPLICATION</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
          {/* ══════════ STEP C: REVIEW & SUBMIT ══════════ */}
          {currentStep === "stepC" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                  <FileCheck size={16} className="text-pink-500" />
                  <span>STEP C: REVIEW AND SUBMIT</span>
                </h3>
                <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full">
                  Verification Summary
                </span>
              </div>
              {/* Applicant Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2 text-xs">
                <h4 className="font-extrabold text-purple-950 text-sm mb-2">
                  Applicant Profile
                </h4>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Name</span>
                    <span className="font-bold text-gray-800">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact</span>
                    <span className="font-bold text-gray-800">{formData.phoneCode} {formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Destination</span>
                    <span className="font-bold text-pink-600">{selectedCountryName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Permit Category</span>
                    <span className="font-bold text-gray-800 capitalize">
                      {formData.permitType.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Date of Birth</span>
                    <span className="font-bold text-gray-800">
                      {formData.adDate} (AD) {formData.bsDate && `• ${formData.bsDate} (BS)`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Age Category</span>
                    <span className="font-bold text-purple-950">
                      {getAgeCategoryText(formData.age)}
                    </span>
                  </div>
                </div>
              </div>
              {/* Document Summary (All 5 documents) */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2 text-xs">
                <h4 className="font-extrabold text-purple-950 text-sm mb-2">
                  Uploaded Documentation ({documentRequirements.length} Checkpoints)
                </h4>
                <div className="space-y-1.5 text-gray-600">
                  {filteredDocumentRequirements.map((document) => {
                    const file = formData.files[document.document_type];
                    return (
                      <div
                        key={document.id}
                        className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-gray-700 font-semibold">
                          {document.title}:
                        </span>
                        {file ? (
                          <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2
                              size={13}
                              className="text-emerald-600 flex-shrink-0"
                            />
                            <span className="truncate max-w-[180px]">
                              {file.name}
                            </span>
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">
                            {document.is_required
                              ? "Missing (Required)"
                              : "Not provided (Optional)"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                By clicking Submit, your application enters our official verification queue. You will receive real-time notifications via WhatsApp ({formData.phoneCode} {formData.phone}) as the file progresses through the Foreign Employment Office (FEO).
              </div>
              {/* Navigation buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("stepB")}
                  disabled={isSubmitting}
                  className="w-1/3 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-2/3 rounded-2xl bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-pink-300/40 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>SUBMITTING APPLICATION...</span>
                    </>
                  ) : (
                    <>
                      <span>CONFIRM &amp; SUBMIT APPLICATION</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          {/* ══════════ STEP PAYMENT: ESEWA & PAY LATER ══════════ */}
          {currentStep === "payment" && (
            <div className="space-y-3">
              <PaymentMethod
                bookingReference={applicationId}
                packageTitle={`Work Permit (${selectedCountryName || "Government Shram"})`}
                category="Work Permit"
                tierName={getFeeTierLabel()}
                guestsCount={1}
                unitPriceFormatted={totalPriceFormatted}
                totalPriceFormatted={totalPriceFormatted}
                travelDate={formData.adDate ? `DOB: ${formData.adDate}` : undefined}
                isProcessingPayment={isProcessingPayment}
                initialMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                onPayWithEsewa={handleEsewaPayment}
                onPayLater={handlePayLater}
              />
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep("stepC")}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline transition-colors cursor-pointer"
                >
                  ← Edit Application Details
                </button>
              </div>
            </div>
          )}
          {/* ══════════ STAGE AFTER SUBMIT ══════════ */}
          {currentStep === "submitted" && (
            <div className="text-center py-4 space-y-6">
              {/* Success Badge */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ring-8 ${paymentStatus === "paid"
                ? "bg-emerald-100 text-emerald-600 ring-emerald-50"
                : "bg-amber-100 text-amber-600 ring-amber-50"
                }`}>
                <CheckCircle2 size={36} />
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${paymentStatus === "paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
                  }`}>
                  {paymentStatus === "paid" ? "Payment Received • Application Logged" : "Application Logged • Payment Pending"}
                </span>
                <h3 className="text-2xl font-black text-purple-950 mt-2">
                  Application Submitted Successfully!
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  Tracking ID: <span className="font-bold text-pink-600 text-sm">{applicationId}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  Total Fee: <span className="font-bold text-slate-800">{totalPriceFormatted}</span> ({selectedPaymentMethod === "esewa" ? (paymentStatus === "paid" ? "Paid via eSewa" : "eSewa Pending") : "Pay Later"})
                </p>
              </div>
              {/* What Happens Next */}
              <div className="text-left bg-gradient-to-br from-slate-50 to-purple-50/40 p-5 rounded-3xl border border-purple-100/80 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-pink-600" />
                  <h4 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">
                    Post-Submission Processing Flow
                  </h4>
                </div>
                {/* Step 1: Officer Verification */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-purple-950">
                      Officer Verification &amp; Embassy Matching
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Our licensed officers verify your passport, match embassy records, authenticate the foreign employment contract, and prepare government Shram submission.
                    </p>
                  </div>
                </div>
                {/* Step 2: Automated Notification */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BellRing size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-900">
                      Automated Status Tracking
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Instant alerts dispatched to your WhatsApp ({formData.phoneCode} {formData.phone}) at every approval milestone until your digital Work Permit is downloaded.
                    </p>
                  </div>
                </div>
              </div>
              {/* Quick WhatsApp Link, Download PDF Slip & Close */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/9779851420882?text=${encodeURIComponent(
                    `Hello Trip Himalaya! I just submitted my Work Permit application (ID: ${applicationId}) for ${formData.name} to ${selectedCountryName}. Total Fee: ${totalPriceFormatted}. Payment Method: ${selectedPaymentMethod === "esewa" ? (paymentStatus === "paid" ? "eSewa (PAID)" : "eSewa (PENDING)") : "Pay Later (PENDING)"}. Please confirm receipt.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs py-3.5 flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Notify via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleDownloadSlip}
                  className="flex-1 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs py-3.5 flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Printer size={16} />
                  <span>Download PDF Slip</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3.5 px-6 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};
export default WorkPermitModal;
