"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { SITE_URL, Setting, Watermark } from "@/lib/constants";

export function useSettingsPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Setting>({
    id_setting: 1,
    logo_url_setting: `${SITE_URL}/assets/images/logo.png`,
    title_setting: "Catálogo de Productos",
    description_setting: "Catálogo completo de productos disponibles en nuestra tienda.",
    category_bg_setting: "#0ea5e9",
    orientation_setting: "portrait",
    template_setting: "grid",
    watermark_setting: {
      enabled: true,
      text: "Marca Agua",
      color: "#64748b",
      opacity: 0.2,
      size: 15,
      rotation: -45,
    },
    date_created_setting: new Date(),
    date_updated_setting: new Date(),
  });

  const previewRef = React.useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (previewRef.current) {
      const { offsetWidth, offsetHeight } = previewRef.current;
      setContainerSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [formData]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/setting");
        if (!res.ok) throw new Error("Error al obtener ajustes");

        const data: Setting = await res.json();

        if (data) {
          setFormData((prev) => ({
            ...prev,
            ...data,
            watermark_setting: typeof data.watermark_setting === 'string'
            ? JSON.parse(data.watermark_setting)
            : data.watermark_setting || prev.watermark_setting,

          }));
        }
      } catch (error) {
        toast.error("No se pudo cargar ajustes, usando valores por defecto");
      }
    };

    fetchSettings();
  }, []);

  const handleWatermarkChange = (name: keyof Watermark, value: any) => {
    setFormData((prev) => ({
      ...prev,
      watermark_setting: {
        ...prev.watermark_setting,
        [name]: value,
      },
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof Setting]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/setting", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!res.ok) throw new Error("Error al guardar ajustes");
  
      toast.success("Ajustes guardados correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron guardar los ajustes");
    }
  };

  const handleReset = () => {
    const defaultData: Setting = {
      id_setting: 1,
      logo_url_setting: `${SITE_URL}/assets/images/logo.png`,
      title_setting: "Catálogo de Productos",
      description_setting: "Catálogo completo de productos disponibles en nuestra tienda.",
      category_bg_setting: "#0ea5e9",
      orientation_setting: "portrait",
      template_setting: "grid",
      watermark_setting: {
        enabled: true,
        text: "Marca agua",
        color: "#64748b",
        opacity: 0.2,
        size: 15,
        rotation: -45,
      },
      date_created_setting: new Date(),
      date_updated_setting: new Date(),
    };
    setFormData(defaultData);
    setErrors({});
    toast.success("Ajustes restablecidos a los valores por defecto");
  };

  return {
    errors,
    setErrors,
    formData,
    setFormData,
    containerSize,
    previewRef,
    handleWatermarkChange,
    handleChange,
    handleSave,
    handleReset,
  };
}
