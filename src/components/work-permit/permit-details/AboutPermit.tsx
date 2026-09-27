import { useEffect, useState } from "react";

import {
  AlertCircle,
  CircleCheck,
  CircleHelp,
  FileText,
  Zap,
} from "lucide-react";

import {
  getPermitDocumentRequirementsByCountry,
  getWorkPermitInformationByCountry,
} from "../../../api/BackendApi";


interface CountryProps {
  id: number;
  country_code: string;
  country_name: string;
  iso_2: string;
  flag_code: string;
  short_description: string;
  processing_days: number;
  status: string;
  display_order: number;
}


interface AboutPermitProps {
  id?: string;
  country: CountryProps;
}


interface PermitDocumentRequirement {
  id: number;
  country_id: number;
  permit_type: string;
  document_type: string;
  title: string;
  description?: string | null;
  is_required: boolean;
  display_order: number;
  status: string;
}


interface WorkPermitInformation {
  id: number;
  country_id: number;
  type:
    | "POLICY"
    | "TERMS_CONDITION"
    | "INCLUDED";
  content: string;
  display_order: number;
  status: string;
}


const AboutPermit = ({ country }: AboutPermitProps) => {

  const [documents, setDocuments] = useState<
    PermitDocumentRequirement[]
  >([]);

  const [information, setInformation] = useState<
    WorkPermitInformation[]
  >([]);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // FETCH COUNTRY WORK PERMIT DATA
  // ==========================================

  useEffect(() => {
    if (!country?.id) {
      return;
    }

    const fetchPermitData = async () => {
      try {
        setLoading(true);

        const [
          documentResponse,
          informationResponse,
        ] = await Promise.all([
          getPermitDocumentRequirementsByCountry(
            country.id
          ),
          getWorkPermitInformationByCountry(
            country.id
          ),
        ]);

        // DOCUMENT REQUIREMENTS
        if (documentResponse.data?.status) {
          setDocuments(
            Array.isArray(documentResponse.data.data)
              ? documentResponse.data.data
              : []
          );
        } else {
          setDocuments([]);
        }

        // WORK PERMIT INFORMATION
        if (informationResponse.data?.status) {
          setInformation(
            Array.isArray(informationResponse.data.data)
              ? informationResponse.data.data
              : []
          );
        } else {
          setInformation([]);
        }

      } catch (error) {
        console.error(
          "Failed to fetch work permit information:",
          error
        );

        setDocuments([]);
        setInformation([]);

      } finally {
        setLoading(false);
      }
    };

    fetchPermitData();

  }, [country?.id]);


  // ==========================================
  // SPLIT INFORMATION BY TYPE
  // ==========================================

  const included = information.filter(
    (item) => item.type === "INCLUDED"
  );

  const policies = information.filter(
    (item) => item.type === "POLICY"
  );

  const terms = information.filter(
    (item) =>
      item.type === "TERMS_CONDITION"
  );


  return (
    <div className="col-span-1 lg:col-span-2">

      {/* ======================================
          ABOUT PERMIT
      ====================================== */}

      <div className="rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-gray-300">

        <div className="p-5 sm:p-8 md:p-10">

          <div>
            <header className="flex items-center gap-2">

              <FileText
                size={18}
                className="text-pink-500"
              />

              <p className="text-purple-950 text-lg sm:text-xl font-bold mb-2">
                About {country.country_name} Permit
              </p>

            </header>

            <p className="text-gray-500 font-semibold py-2 sm:py-4 mb-4 sm:mb-6 text-sm sm:text-base">
              {country.short_description ||
                "No description available."}
            </p>
          </div>


          {loading ? (

            <div className="py-6 text-sm font-semibold text-gray-500">
              Loading permit information...
            </div>

          ) : (

            <div className="flex flex-col sm:flex-row w-full justify-between gap-6">

              {/* ==================================
                  REQUIREMENT DOCUMENTS
              ================================== */}

              <div className="w-full sm:w-[48%]">

                <h1 className="flex items-center gap-2 text-purple-950 font-bold text-base sm:text-xl">

                  <CircleCheck
                    size={16}
                    className="text-green-500 flex-shrink-0"
                  />

                  REQUIREMENT DOCUMENTS

                </h1>


                {documents.length > 0 ? (

                  <ul className="list-disc marker:text-pink-500 list-inside mt-2">

                    {documents.map((document) => (

                      <li
                        key={document.id}
                        className="text-gray-500 font-semibold mb-1 text-sm sm:text-base"
                      >
                        {document.title}
                      </li>

                    ))}

                  </ul>

                ) : (

                  <p className="text-gray-400 font-semibold mt-2 text-sm">
                    No document requirements available.
                  </p>

                )}

              </div>


              {/* ==================================
                  WHAT'S INCLUDED
              ================================== */}

              <div className="w-full sm:w-[48%]">

                <h1 className="flex items-center gap-2 text-purple-950 font-bold text-base sm:text-xl">

                  <Zap
                    size={16}
                    className="text-pink-500 flex-shrink-0"
                  />

                  WHAT&apos;S INCLUDED

                </h1>


                {included.length > 0 ? (

                  <ul className="list-disc marker:text-green-500 list-inside mt-2">

                    {included.map((item) => (

                      <li
                        key={item.id}
                        className="text-gray-500 font-semibold mb-1 text-sm sm:text-base"
                      >
                        {item.content}
                      </li>

                    ))}

                  </ul>

                ) : (

                  <p className="text-gray-400 font-semibold mt-2 text-sm">
                    No included services available.
                  </p>

                )}

              </div>

            </div>

          )}

        </div>

      </div>


      {/* ======================================
          POLICY + TERMS
      ====================================== */}

      {!loading && (
        <div className="flex flex-col sm:flex-row items-stretch w-full justify-between gap-6 mt-6 sm:mt-8">

          {/* POLICY */}

          <div className="shadow-xl shadow-gray-200 w-full sm:w-[48%] rounded-2xl sm:rounded-3xl bg-purple-950 p-6 sm:p-8 md:p-10">

            <h1 className="flex items-center gap-2 text-white text-lg sm:text-xl font-bold">

              <AlertCircle
                size={16}
                className="text-pink-500 flex-shrink-0"
              />

              Policy

            </h1>


            {policies.length > 0 ? (

              <ul className="list-disc marker:text-gray-400 list-inside mt-2">

                {policies.map((item) => (

                  <li
                    key={item.id}
                    className="text-gray-400 font-semibold text-xs sm:text-sm mb-1"
                  >
                    {item.content}
                  </li>

                ))}

              </ul>

            ) : (

              <p className="text-gray-400 font-semibold text-xs sm:text-sm mt-2">
                No policy information available.
              </p>

            )}

          </div>


          {/* TERMS & CONDITIONS */}

          <div className="shadow-xl shadow-gray-200 w-full sm:w-[48%] rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8">

            <h1 className="flex items-center gap-2 text-purple-950 text-lg sm:text-xl font-bold">

              <CircleHelp
                size={16}
                className="text-pink-500 flex-shrink-0"
              />

              Terms &amp; Conditions

            </h1>


            {terms.length > 0 ? (

              <ul className="list-disc marker:text-gray-400 list-inside mt-2">

                {terms.map((item) => (

                  <li
                    key={item.id}
                    className="text-gray-600 font-semibold text-xs sm:text-sm mb-1.5 leading-relaxed"
                  >
                    {item.content}
                  </li>

                ))}

              </ul>

            ) : (

              <p className="text-gray-400 font-semibold text-xs sm:text-sm mt-2">
                No terms and conditions available.
              </p>

            )}

          </div>

        </div>
      )}

    </div>
  );
};


export default AboutPermit;