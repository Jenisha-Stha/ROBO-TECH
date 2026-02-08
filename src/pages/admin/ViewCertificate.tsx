import { AdminLayout } from '@/components/admin/AdminLayout';
import CertificatePdf from '@/components/CertificatePdf';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router';

export default function ViewCertificate() {
  const { user: authUser } = useAuth();
  const { courseId } = useParams();
  const [certificate, setCertificate] = React.useState<any>(null);
  const [date, setDate] = React.useState<string>("");
  const certificateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchCertificate() {
      const { data, error } = await supabase
        .from("user_course_response")
        .select(
          `
                 updated_at,
                    courses (
                      id,
                      title,
                      course_type,
                      image_asset_id,
                      image_asset:assets!courses_image_asset_id_fkey(
                      url
                      )
                    )
              `).eq("user_id", authUser.id)
        .eq("is_completed", true)
        .eq("course_id", courseId).single()
      if (error) {
        console.error("Error fetching certificate:", error);
      } else {
        setCertificate(data.courses || []);
        const dateObj = new Date(data.updated_at);

        setDate(dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) || "");
      }
    }
    fetchCertificate()

  }, [courseId, authUser.id]);

  return (
    <AdminLayout title='Certificate'>
      <div className="flex flex-col items-center gap-6 p-6">
        <div
          ref={certificateRef}
          className="relative w-full max-w-3xl"
        >
          {/* PNG Background Image */}
          <img
            src="/images/robocertificate.png"
            alt="Certificate"
            className="w-full h-auto object-contain block"
          />

          {/* Overlay Text */}
          {certificate && authUser && (
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
              {/* Name */}
              <div className="text-center" style={{ marginTop: '10%' }}>
                <h1 className="text-4xl font-bold text-gray-800" >
                  {authUser.alias_name || authUser.full_name}
                </h1>
                {/* {authUser.alias_name && (
                  <p className="text-xl md:text-2xl text-gray-600 mt-2">
                    ({authUser.alias_name})
                  </p>
                )} */}
              </div>

              {/* Course Name */}
              <div className="text-center mt-10">
                <p className="text-base font-semibold text-gray-700" >
                  {certificate.title}
                </p>
              </div>

              {/* Date */}
              {date && (
                <div className="text-center mt-10">
                  <p className="text-sm text-gray-600">
                    {date}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {certificate && authUser && (
          <PDFDownloadLink
            document={
              <CertificatePdf
                username={authUser.full_name}
                aliasName={authUser.alias_name}
                courseName={certificate.title}
                dateStr={date}
              />
            }
            fileName={`${(authUser.alias_name || authUser.full_name || 'certificate').replace(/\s+/g, "_")}_certificate.pdf`}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-lg font-medium transition-colors no-underline"
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Generating PDF...' : 'Download PDF'
            }
          </PDFDownloadLink>
        )}
      </div>
    </AdminLayout>
  )
}