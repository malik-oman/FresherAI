import React, { useEffect, useState } from 'react'
import Step3report from '../components/interview/Step3report'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterview } from '../apis/interview.api'

const ReportInterview = ({user,setUser}) => {
  const {id} = useParams()
    const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      const response = await getInterview(id);
      const data = response?.interview;
      if (data.status !== "completed") {
        navigate(`/interview/${id}`, { replace: true });
        return;
      }
      setReport(data);
      setLoading(false);
    };
    fetchReport()
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07000f] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!report) {
    return null;
  }
  return (
   <Step3report user={user} setUser={setUser}  report={report} />
  )
}

export default ReportInterview

// http://localhost:5173/interview/6ab48b7de56ee51e5e751999/report