import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import React, { useEffect } from 'react'
import { Link } from 'react-router';


export default function Certificates() {
  const { user: authUser } = useAuth();
  const userId = authUser.id;
  const [certificates, setCertificates] = React.useState<any[]>([]);
  useEffect(() => {
    async function fetchCompletedCourses() {
      const { data, error } = await supabase
        .from("user_course_response")
        .select(
          `
                course_id,
                is_completed,
                created_at,
                updated_at,
                courses (
                  id,
                  title,
                  course_type,
                  image_asset_id,
                  is_erased,
                  is_active,
                  image_asset:assets!courses_image_asset_id_fkey(
                  url
                  )
                )
              `
        )
        .eq("user_id", userId)
        .eq("is_completed", true);
      if (error) {
        console.error("Error fetching completed courses:", error);
      } else {
        console.log("data", data)
        // Filter out courses where is_erased is true or is_active is false or course is null
        const filteredData = (data || []).filter((item) => {
          console.log(item.courses)
          const course = Array.isArray(item.courses) ? item.courses[0] : item.courses;
          console.log("course", course)
          return course && course.is_erased === false && course.is_active === true;
        });
        setCertificates(filteredData);
      }
    }
    fetchCompletedCourses();
  }, [userId])
  console.log({ certificates })
  return (
    <AdminLayout title='Certificates' subtitle="Certificates for completed courses">
      {
        certificates.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No completed courses found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates
              .map((cert) => {
                const course = Array.isArray(cert.courses) ? cert.courses[0] : cert.courses;
                if (!course) return null;

                return (
                  <div key={cert.course_id} className="border rounded-lg p-4 shadow hover:shadow-lg transition-all duration-200">
                    <img
                      src={course.image_asset?.url || '/images/drone.jpg'}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                    <h2 className="text-lg font-bold mb-2">{course.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Completed on: {new Date(cert.updated_at).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/admin/certificates/${cert.course_id}`}
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                      View Certificate
                    </Link>
                  </div>
                );
              })
              .filter(Boolean)}
          </div>
        )
      }
    </AdminLayout>
  )
}