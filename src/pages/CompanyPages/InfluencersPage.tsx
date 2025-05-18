import { useState, useEffect } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/ui/Card";
import { ProgressSpinner } from "primereact/progressspinner";
import { InfluencerCard } from "../../components/Company/influencerCard";
import { PromotionSlider } from "../../components/slider";
import { UserService } from "../../services/UserService";
import { ContentCreator } from "../../types";
import { Filter, X } from "lucide-react";

const userService = new UserService();

const categories = [
  { name: "Moda", code: "fashion" },
  { name: "Güzellik", code: "beauty" },
  { name: "Seyahat", code: "travel" },
  { name: "Yemek", code: "food" },
  { name: "Fitness", code: "fitness" },
  { name: "Teknoloji", code: "tech" },
  { name: "Oyun", code: "gaming" },
  { name: "Eğitim", code: "education" },
  { name: "Spor", code: "sports" },
  { name: "Müzik", code: "music" },
];

const STORAGE_KEY = "influencer_filters";

type FilterState = {
  category: string;
  minFollowers: number | undefined;
  maxFollowers: number | undefined;
  minScore: number | undefined;
  maxScore: number | undefined;
};

export const InfluencersPage = () => {
  const [contentCreators, setContentCreators] = useState<ContentCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [filters, setFilters] = useState<FilterState>(() => {
    const savedFilters = localStorage.getItem(STORAGE_KEY);
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          category: "",
          minFollowers: undefined,
          maxFollowers: undefined,
          minScore: undefined,
          maxScore: undefined,
        };
  });

  const getFilterLabel = (
    field: keyof FilterState,
    value: string | number | undefined
  ) => {
    if (value === undefined || value === "") return "";

    switch (field) {
      case "category": {
        const category = categories.find((cat) => cat.code === value);
        return category ? category.name : "";
      }
      case "minFollowers":
        return `Min. ${value.toLocaleString()} Takipçi`;
      case "maxFollowers":
        return `Maks. ${value.toLocaleString()} Takipçi`;
      case "minScore":
        return `Min. ${value} Skor`;
      case "maxScore":
        return `Maks. ${value} Skor`;
      default:
        return "";
    }
  };

  const handleFilterReset = async (field: keyof FilterState) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [field]: field === "category" ? "" : undefined,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
      return newFilters;
    });

    setIsLoading(true);
    try {
      const creators = await userService.searchContentCreators({
        ...filters,
        [field]: field === "category" ? "" : undefined,
      });

      if (username.trim()) {
        const filteredCreators = creators.filter((creator) =>
          creator.username.toLowerCase().includes(username.toLowerCase())
        );
        setContentCreators(filteredCreators);
      } else {
        setContentCreators(creators);
      }
    } catch (error) {
      console.error("Filtreli arama hatası:", error);
    }
    setIsLoading(false);
  };

  const handleUsernameReset = async () => {
    setUsername("");
    setIsLoading(true);
    try {
      const creators = await userService.searchContentCreators(filters);
      setContentCreators(creators);
    } catch (error) {
      console.error("Filtreli arama hatası:", error);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      if (username.trim()) {
        const isValid = await userService.validateUser(username);
        console.log(isValid);
        if (!isValid) {
          setContentCreators([]);
          setIsLoading(false);
          return;
        }
      }

      const creators = await userService.searchContentCreators(filters);

      if (username.trim()) {
        const filteredCreators = creators.filter((creator) =>
          creator.username.toLowerCase().includes(username.toLowerCase())
        );
        setContentCreators(filteredCreators);
      } else {
        setContentCreators(creators);
      }
    } catch (error) {
      console.error("Filtreli arama hatası:", error);
    }
    setIsLoading(false);
  };

  const handleResetFilters = async () => {
    const defaultFilters = {
      category: "",
      minFollowers: undefined,
      maxFollowers: undefined,
      minScore: undefined,
      maxScore: undefined,
    };

    setFilters(defaultFilters);
    setUsername("");
    localStorage.removeItem(STORAGE_KEY);

    try {
      setIsLoading(true);
      const response = await userService.getContentCreators();
      setContentCreators(response.data);
    } catch (error) {
      console.error("Influencerler getirilirken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (
    field: keyof FilterState,
    value: string | number | null | undefined
  ) => {
    setFilters((prev: FilterState) => {
      const newFilters = {
        ...prev,
        [field]: value === null ? undefined : value,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
      return newFilters;
    });
  };

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setIsLoading(true);
        const savedFilters = localStorage.getItem(STORAGE_KEY);

        if (savedFilters) {
          const creators = await userService.searchContentCreators(
            JSON.parse(savedFilters)
          );
          setContentCreators(creators);
        } else {
          const response = await userService.getContentCreators();
          setContentCreators(response.data);
        }
      } catch (error) {
        console.error("Influencerler getirilirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppLayout title="Influencerler">
          <div className="flex justify-center items-center h-[50vh]">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="4"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        </AppLayout>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppLayout title="Influencerler">
        <div className="flex flex-col gap-4">
          <PromotionSlider />
          <Card className="mb-4">
            <h1 className="text-3xl font-bold text-[#6b21a8] mb-2 flex items-center gap-2">
              <Filter className="text-2xl" />
              Filtreler
            </h1>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {username && (
                  <div
                    className="group flex items-center gap-2 bg-purple-100 px-3 py-1.5 rounded-full text-sm text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer"
                    onClick={handleUsernameReset}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleUsernameReset();
                      }
                    }}
                  >
                    <span>Kullanıcı: {username}</span>
                    <X className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {Object.entries(filters).map(([key, value]) => {
                  if (value === undefined || value === "") return null;
                  const field = key as keyof FilterState;
                  const label = getFilterLabel(field, value);
                  if (!label) return null;

                  return (
                    <div
                      key={field}
                      className="group flex items-center gap-2 bg-purple-100 px-3 py-1.5 rounded-full text-sm text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer"
                      onClick={() => handleFilterReset(field)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleFilterReset(field);
                        }
                      }}
                    >
                      <span>{label}</span>
                      <X className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="username"
                  className="font-medium text-sm text-gray-700"
                >
                  Kullanıcı Adı
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                  aria-label="Kullanıcı adı"
                  tabIndex={0}
                  placeholder="Kullanıcı adı ile ara..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="category"
                  className="font-medium text-sm text-gray-700"
                >
                  Kategori
                </label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                  aria-label="Kategori seç"
                  tabIndex={0}
                >
                  {categories.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="minFollowers"
                  className="font-medium text-sm text-gray-700"
                >
                  Min. Takipçi
                </label>
                <input
                  id="minFollowers"
                  type="number"
                  value={filters.minFollowers ?? ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minFollowers",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full border rounded px-2 py-1"
                  aria-label="Minimum takipçi"
                  tabIndex={0}
                  min={0}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="maxFollowers"
                  className="font-medium text-sm text-gray-700"
                >
                  Maks. Takipçi
                </label>
                <input
                  id="maxFollowers"
                  type="number"
                  value={filters.maxFollowers ?? ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxFollowers",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full border rounded px-2 py-1"
                  aria-label="Maksimum takipçi"
                  tabIndex={0}
                  min={0}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="minScore"
                  className="font-medium text-sm text-gray-700"
                >
                  Min. Skor
                </label>
                <input
                  id="minScore"
                  type="number"
                  value={filters.minScore ?? ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minScore",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full border rounded px-2 py-1"
                  aria-label="Minimum skor"
                  tabIndex={0}
                  min={0}
                  max={100}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="maxScore"
                  className="font-medium text-sm text-gray-700"
                >
                  Maks. Skor
                </label>
                <input
                  id="maxScore"
                  type="number"
                  value={filters.maxScore ?? ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxScore",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full border rounded px-2 py-1"
                  aria-label="Maksimum skor"
                  tabIndex={0}
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                aria-label="Tüm filtreleri sıfırla"
              >
                Tümünü Sıfırla
              </button>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                aria-label="Filtreleri uygula"
              >
                Filtrele
              </button>
            </div>
          </Card>

          {contentCreators.length > 0 && (
            <div className="text-sm text-gray-600 mb-4">
              {contentCreators.length} sonuç bulundu
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentCreators.length > 0 ? (
                  contentCreators.map((influencer) => (
                    <InfluencerCard
                      key={influencer.id}
                      influencer={influencer}
                    />
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card>
                      <div className="text-center py-6">
                        <h3 className="text-lg font-semibold mb-2">
                          Influencer Bulunamadı
                        </h3>
                        <p className="text-gray-600">
                          Henüz hiç influencer bulunmamaktadır.
                        </p>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};
