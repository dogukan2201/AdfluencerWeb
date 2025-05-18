import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { CampaignService } from "../../services/Campaign";
import { Invitation } from "../../types";
import { AppLayout } from "../../components/layout/AppLayout";
import { Tag } from "primereact/tag";

const MyApplicationPage = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const campaignService = new CampaignService();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getCompanyInvitations();
      setInvitations(response);
    } catch (error) {
      console.error("Davetler yüklenirken hata oluştu:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Davetler yüklenirken bir hata oluştu",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusSeverity = (status: number) => {
    switch (status) {
      case 0:
        return "warning";
      case 1:
        return "success";
      case 2:
        return "danger";
      default:
        return "info";
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Beklemede";
      case 1:
        return "Kabul Edildi";
      case 2:
        return "Reddedildi";
      default:
        return "Bilinmiyor";
    }
  };

  const statusBodyTemplate = (rowData: Invitation) => {
    return (
      <Tag
        value={getStatusLabel(rowData.status)}
        severity={getStatusSeverity(rowData.status)}
      />
    );
  };

  const influencerBodyTemplate = (rowData: Invitation) => {
    return (
      <div className="flex items-center gap-2">
        <img
          src={rowData.influencer?.profileImage || "/default-avatar.png"}
          alt={rowData.influencer?.name}
          className="w-8 h-8 rounded-full"
        />
        <span>{rowData.influencer?.name}</span>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <Toast ref={toast} />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Gelen Başvurular</h1>
          <DataTable
            value={invitations}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            className="p-datatable-sm"
            emptyMessage="Henüz başvuru bulunmuyor"
          >
            <Column
              field="title"
              header="Kampanya"
              sortable
              className="min-w-[200px]"
            />
            <Column
              header="Influencer"
              body={influencerBodyTemplate}
              className="min-w-[200px]"
            />
            <Column
              field="description"
              header="Açıklama"
              className="min-w-[300px]"
            />
            <Column
              field="budget"
              header="Bütçe"
              className="min-w-[150px]"
              body={(rowData) => `₺${rowData.budget}`}
            />
            <Column
              field="status"
              header="Durum"
              body={statusBodyTemplate}
              sortable
              className="min-w-[150px]"
            />
          </DataTable>
        </div>
      </div>
    </AppLayout>
  );
};

export { MyApplicationPage };
