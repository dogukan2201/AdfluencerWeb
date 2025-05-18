import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { CampaignService } from "../../services/Campaign";
import { Invitation } from "../../types";
import { AppLayout } from "../../components/layout/AppLayout";
import { Dropdown } from "primereact/dropdown";

const MyInvitationsPage = () => {
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
      const response = await campaignService.getMyInvitations();
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
  const updateStatus = async (invitationId: number, status: number) => {
    try {
      const response = await campaignService.updateInvitationStatus(
        invitationId,
        status
      );
      console.log(response);
      fetchInvitations();
    } catch (error) {
      console.error("Durum güncellenirken hata oluştu:", error);
    }
  };

  const statusBodyTemplate = (rowData: Invitation) => {
    const statusOptions = [
      { label: "Beklemede", value: 0 },
      { label: "Kabul Edildi", value: 1 },
      { label: "Reddedildi", value: 2 },
    ];

    return (
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-sm `}>
          <Dropdown
            value={rowData.status}
            options={statusOptions}
            onChange={(e) => updateStatus(rowData.id, e.value)}
            optionLabel="label"
            optionValue="value"
          />
        </span>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <Toast ref={toast} />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Davetlerim</h1>
          <DataTable
            value={invitations}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            className="p-datatable-sm"
            emptyMessage="Henüz davet bulunmuyor"
          >
            <Column
              field="title"
              header="Kampanya"
              sortable
              className="min-w-[200px]"
            />
            <Column
              field="description"
              header="Açıklama"
              className="min-w-[300px]"
            />
            <Column field="budget" header="Bütçe" className="min-w-[150px]" />
            <Column
              field="status"
              header="Durum"
              body={statusBodyTemplate}
              sortable
            />
          </DataTable>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyInvitationsPage;
