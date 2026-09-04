import { ArrowRight, FileText, Upload } from "lucide-react";
import { ADToBS } from "bikram-sambat-js";
import { useRef, useState } from "react";

interface CountryProps {
  id: string;
  name: string;
  flag: string;
  desc: string;
}

type FileKeys = "passport" | "arrivalStamp" | "visaCopy";

interface FormDataType {
  name: string;
  phone: string;
  country: string;
  permitType: string;
  adDate: string;
  bsDate: string;
  age: number | null;
  files: Record<FileKeys, File | null>;
}

interface WorkPermitModalProps {
  country: CountryProps[];
}

const WorkPermitModal = ({ country }: WorkPermitModalProps) => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    phone: "",
    country: "",
    permitType: "new_labour_permit",
    adDate: "",
    bsDate: "",
    age: null,
    files: {
      passport: null,
      arrivalStamp: null,
      visaCopy: null,
    },
  });

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fileFields = [
    { key: "passport", label: "Passport Copy*" },
    { key: "arrivalStamp", label: "Arrival Stamp*" },
    { key: "visaCopy", label: "Visa Copy*" },
  ] as const;

  const handleButtonClick = (key: string) => {
    fileRefs.current[key]?.click();
  };

  const handleFileChange = (key: FileKeys, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [key]: file,
      },
    }));
  };

  const handleConvert = (value: string) => {
    if (!value) {
      setFormData((prev) => ({
        ...prev,
        adDate: "",
        bsDate: "",
        age: null,
      }));
      return;
    }

    try {
      const age = calculateAge(value);
      const bs = ADToBS(value);

      setFormData((prev) => ({
        ...prev,
        adDate: value,
        bsDate: bs,
        age,
      }));
    } catch {
      setFormData((prev) => ({
        ...prev,
        adDate: value,
        bsDate: "",
        age: null,
      }));
    }
  };

  const calculateAge = (adDate: string): number => {
    const birthDate = new Date(adDate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Name is required");
    if (!formData.phone.trim()) errors.push("Phone is required");
    if (!formData.country) errors.push("Country is required");
    if (!formData.adDate) errors.push("Date of birth is required");

    // basic phone validation
    if (formData.phone && !/^9\d{9}$/.test(formData.phone)) {
      errors.push("Phone must be valid (98XXXXXXXX)");
    }

    // file validation
    Object.entries(formData.files).forEach(([key, file]) => {
      if (!file) {
        errors.push(`${key} file is required`);
      }
    });

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();

    if (errors.length > 0) {
      console.log("VALIDATION ERRORS:", errors);
      alert(errors.join("\n"));
      return;
    }

    console.log("FINAL FORM DATA:", formData);
  };

  return (
    <dialog id="work_permit_modal" className="modal w-full">
      <div className="modal-box rounded-3xl max-w-2xl ">
        <form method="dialog" onSubmit={handleSubmit} className="h-130 p-2">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-xl text-purple-950">
                Online Application
              </h1>
              <h4 className="text-gray-400 text-xs tracking-widest font-semibold">
                FILL IN YOUR DETAILS TO PROCEED
              </h4>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </header>
          <div className="mt-4">
            <h3 className="flex gap-2 items-center text-purple-950 font-bold text-sm">
              <FileText size={14} className="text-pink-500" />
              BASIC INFORMATION
            </h3>

            {/* form content */}
            <div className="mt-3 h-">
              <label className="text-xs text-gray-400 font-bold">Name*</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input w-full"
              />
            </div>
            {/* number */}
            <div className="mt-2">
              <label className="text-xs text-gray-400 font-bold">
                Phone Number*
              </label>
              <div className="flex gap-2">
                <select defaultValue="+977" className="select w-fit">
                  <option selected value="+977">
                    +977
                  </option>
                  <option value="">+4</option>
                </select>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>
            </div>

            {/* dob */}

            <div className="mt-2">
              <label className="text-xs text-gray-400 font-bold">
                Date of Birth
              </label>
              <div className="mt-2 flex gap-2 justify-between">
                <div className="w-1/2">
                  <label className="text-xs text-gray-400 font-bold">AD</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.adDate}
                    onChange={(e) => handleConvert(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-xs text-gray-400 font-bold">
                    BS (NEPALI)
                  </label>
                  <input value={formData.bsDate} className="input" readOnly />
                </div>
              </div>
            </div>

            {/* age */}
            <div className="mt-2 w-full">
              <label className="text-xs text-gray-400 font-bold">
                Age (Auto-Calulated)
                <input
                  value={formData.age !== null ? `${formData.age} Years` : "--"}
                  className="input text-black w-full"
                  readOnly
                />
              </label>
            </div>
          </div>
          {/* counrty */}
          <div className="flex items-center gap-2">
            <div className="w-1/2">
              <label className="text-xs text-gray-400 font-bold">
                Country*
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="select"
              >
                <option disabled selected value="">
                  Select Country
                </option>
                {country.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label className="text-xs text-gray-400 font-bold">
                Service Permit Type(Auto)
              </label>
              <select name="" id="" required className="select">
                <option selected value="new_labour_permit">
                  New Labour Permit
                </option>
              </select>
            </div>
          </div>{" "}
          <h3 className="flex gap-2 items-center text-purple-950 font-bold text-sm mt-6">
            <Upload size={14} className="text-pink-500" />
            REQUIRED DOCUMENTS UPLOAD
          </h3>
          {/* passport */}
          {fileFields.map((field) => (
            <div
              key={field.key}
              className="w-full rounded-2xl bg-gray-50 p-4 mt-2"
            >
              <label className="text-xs text-gray-600 font-bold">
                {field.label}
              </label>

              <input
                type="file"
                className="hidden"
                ref={(el) => {
                  fileRefs.current[field.key] = el;
                }}
                onChange={(e) =>
                  handleFileChange(field.key, e.target.files?.[0] || null)
                }
              />

              <div className="flex gap-2 items-center mt-1">
                <div
                  className="cursor-pointer rounded-3xl px-5 text-sm tracking-wide py-1 bg-pink-500 text-white w-fit"
                  onClick={() => handleButtonClick(field.key)}
                >
                  Browse...
                </div>

                {formData.files[field.key] ? (
                  <p className="text-sm text-gray-500">
                    {formData.files[field.key]?.name}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">No file selected.</p>
                )}
              </div>
            </div>
          ))}
          <div>
            {" "}
            <h3 className="flex gap-2 items-center text-purple-950 font-bold text-sm mt-6">
              <Upload size={14} className="text-pink-500" />
              OPTIONAL DOCUMENTS
            </h3>
            <div className="w-full rounded-2xl bg-gray-50 p-4 mt-2">
              <label className="label">
                <input type="checkbox" className="checkbox" />
                Company Change
              </label>
            </div>
          </div>
          <div className="py-4">
            <button
              type="submit"
              className="rounded-2xl  bg-pink-500 flex justify-center items-center w-full p-3 gap-2 shadow-lg shadow-pink-300/60"
            >
              SUBMIT APPLICATION <ArrowRight size={14} strokeWidth={4} />
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default WorkPermitModal;
