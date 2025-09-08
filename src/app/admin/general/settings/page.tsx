"use client";
import React, { useEffect, useState } from "react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { SITE_URL } from "@/lib/constants/site";
import { toast } from "sonner";
import { Input, Textarea, Button, Label, Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogTitle, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";
import { Image as ImageIcon, Info } from 'lucide-react'
import FilesPage from '../archivos/page';

type FilePickerProps = {
  value: string;
  onChange: (url: string) => void;
};

export function FilePickerInput({ value, onChange }: FilePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelectFile = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  return (
    <div className="flex flex-col w-full">
    <Label className="font-semibold mb-2">(URL) de la imagen del logo</Label>
    <div className="flex gap-1">
      <Input
        type="text"
        name="logo_url"
        value={`${value}`}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.png"
        className="border rounded-lg p-2 flex-1"
      />
      <Button type="button" variant="outline" onClick={() => setOpen(true)} className="cursor-pointer">
        <ImageIcon className="w-5 h-5" />
      </Button>
    </div>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="flex items-center text-xs text-blue-500 mt-1 cursor-help">
            <Info className="w-4 h-4 mr-1" />
            Recomendación
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Imagen en formato <b>PNG</b> (255px × 155px, fondo transparente)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl h-[80vh] sm:max-w-[70%] overflow-y-auto p-0 pt-10">
        <VisuallyHidden>
          <DialogTitle>Seleccionar archivo</DialogTitle>
        </VisuallyHidden>
        <FilesPage onSelect={handleSelectFile} />
      </DialogContent>
    </Dialog>
  </div>
  );
}

const SettingsPage = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    id: 1,
    logo_url: `${SITE_URL}/assets/images/logo.png`,
    title: "Catálogo de Productos",
    description:"Catálogo completo de productos disponibles en nuestra tienda.",
    category_bg: "#0ea5e9",
    orientation: "portrait",
    template: "grid",
    watermark: {
      enabled: true,
      text: "Marca Agua",
      color: "#64748b",
      opacity: 0.2,
      size: 15,
      rotation: -45,
    },
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

        const data = await res.json();

        if (data) {
          setFormData((prev) => ({
            ...prev,
            ...data,
            watermark: {
              ...prev.watermark,
              ...(data.watermark || {}),
            },
          }));
        }
      } catch (error) {
        toast.error("No se pudo cargar ajustes, usando valores por defecto");
      }
    };

    fetchSettings();
  }, []);

  const handleWatermarkChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      watermark: {
        ...prev.watermark,
        [name]: value,
      },
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

  return (
    <>
      <div className="flex flex-col items-start">
        <h1 className="text-4xl font-bold tracking-tight">Ajustes</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Ajustes generales para generar el catálogo de productos en PDF
        </p>
      </div>

      <div className="rounded-lg shadow-md border-1 bg-white dark:bg-neutral-900">
        <div className="p-4 space-y-4">
          {/* Formulario */}
          <div className="rounded-lg">
            <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-2">
              {/* Logo */}
              <FilePickerInput
                value={formData.logo_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, logo_url: url }))}
              />

              {/* Título */}
              <div className="flex flex-col">
                <Label className="font-semibold mb-2">Título del PDF</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border rounded-lg p-2 focus:ring-2 focus:ring-gray-800"
                />
              </div>

              {/* Descripción */}
              <div className="flex flex-col ">
                <Label className="font-semibold mb-2">
                  Descripción del PDF
                </Label>
                <Textarea
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border rounded-lg p-2 focus:ring-2 focus:ring-gray-800 resize-none"
                />
              </div>

              {/* Color de fondo categorías */}
              <div className="flex flex-col">
                <Label className="font-semibold mb-2">
                  Color de Fondo de Categorías
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="category_bg"
                    name="category_bg"
                    type="color"
                    value={formData.category_bg}
                    onChange={handleChange}
                    className={`w-20 h-10 p-1 ${
                      errors.category_bg ? "border-red-500" : ""
                    }`}
                  />
                  <Input
                    name="category_bg"
                    value={formData.category_bg}
                    onChange={handleChange}
                    className={`flex-1 ${
                      errors.category_bg ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  Se aplicará en los bloques de categorías
                </span>
              </div>

              {/* Orientación del PDF */}
              <div className="flex flex-col">
                <Label className="font-semibold mb-2">Orientación del PDF</Label>
                <Select
                  value={formData.orientation}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, orientation: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona la orientación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Vertical (Portrait)</SelectItem>
                    <SelectItem value="landscape">Horizontal (Landscape)</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-gray-500 mt-1">
                  Define si el catálogo se generará en formato vertical o horizontal.
                </span>
              </div>

              <div className="flex flex-col">
                <Label className="font-semibold mb-2">Plantilla del PDF</Label>
                <Select
                  value={formData.template}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, template: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Plantilla 1 - Cuadrícula</SelectItem>
                    <SelectItem value="list">Plantilla 2 - Lista</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-gray-500 mt-1">
                  Selecciona la plantilla que se usará al generar el catálogo en PDF.
                </span>
              </div>

              {/* Marca de Agua */}
              <div className="md:col-span-2 border-t">
                <h3 className="text-lg font-semibold mb-3">Marca de Agua</h3>

                <div className="flex items-center gap-2 mb-4">
                  <Checkbox
                    checked={formData.watermark.enabled}
                    onCheckedChange={(e) => handleWatermarkChange("enabled", e)}
                  />
                  <Label>Activar marca de agua</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Label className="font-semibold mb-1">Texto</Label>
                    <Input
                      type="text"
                      value={formData.watermark.text}
                      onChange={(e) => handleWatermarkChange("text", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label className="font-semibold mb-1">Opacidad de la marca de agua</Label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={formData.watermark.opacity}
                      onChange={(e) => handleWatermarkChange("opacity", Number(e.target.value))}
                    />
                    <span className="text-xs text-gray-500">
                      {Math.round(formData.watermark.opacity * 100)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col">
                    <Label className="font-semibold mb-1">Color de texto</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={formData.watermark.color}
                        onChange={(e) => handleWatermarkChange("color", e.target.value)}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={formData.watermark.color.toUpperCase()}
                        onChange={(e) => handleWatermarkChange("color", e.target.value)}
                        className="flex-1 border rounded-lg p-2"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label className="font-semibold mb-1">Tamaño de texto</Label>
                    <input
                      type="range"
                      min="8"
                      max="100"
                      step="1"
                      value={formData.watermark.size}
                      onChange={(e) =>
                        handleWatermarkChange("size", Number(e.target.value))
                      }
                    />
                    <span className="text-xs text-gray-500">
                      {formData.watermark.size}px
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <Label className="font-semibold mb-1">Rotación</Label>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="1"
                      value={formData.watermark.rotation}
                      onChange={(e) =>
                        handleWatermarkChange("rotation", Number(e.target.value))
                      }
                    />
                    <span className="text-xs text-gray-500">
                      {formData.watermark.rotation}°
                    </span>
                  </div>
                </div>

              </div>

              <div className="md:col-span-2 flex justify-end gap-4">
              
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    
                    const defaultData = {
                      id: 1,
                      logo_url: `${SITE_URL}/assets/images/logo.png`,
                      title: "Catálogo de Productos",
                      description: "Catálogo completo de productos disponibles en nuestra tienda.",
                      category_bg: "#0ea5e9",
                      orientation: "portrait",
                      template: "grid",
                      watermark: {
                        enabled: true,
                        text: "Marca agua",
                        color: "#64748b",
                        opacity: 0.2,
                        size: 15,
                        rotation: -45,
                      },
                    };
                    setFormData(defaultData);
                    setErrors({});
                    toast.success("Ajustes restablecidos a los valores por defecto");
                  }}
                >
                  Resetear Ajustes
                </Button>

                <Button type="submit" variant="default">
                  Guardar Ajustes
                </Button>
              </div>

            </form>
          </div>

          <div className="px-4 md:px-16 relative">
            <h3 className="text-lg font-semibold mb-2">
              📄 Vista Previa del Catálogo en PDF
            </h3>

            <div ref={previewRef} className="relative border-1 p-4 md:p-8 rounded-lg bg-white overflow-hidden">
              {formData.watermark.enabled && containerSize.width && containerSize.height && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {(() => {
                    const size = formData.watermark.size || 24;
                    const gapX = size * 6;
                    const gapY = size * 6;
                    const cols = Math.ceil(containerSize.width / gapX);
                    const rows = Math.ceil(containerSize.height / gapY);

                    const marks = [];
                    for (let r = 0; r < rows; r++) {
                      for (let c = 0; c < cols; c++) {
                        marks.push(
                          <span
                            key={`wm-${r}-${c}`}
                            className="absolute select-none"
                            style={{
                              top: r * gapY,
                              left: c * gapX,
                              fontSize: `${size}px`,
                              color: formData.watermark.color,
                              opacity: formData.watermark.opacity,
                              transform: `rotate(${formData.watermark.rotation}deg)`,
                              whiteSpace: "pre",
                              textTransform: "uppercase",
                            }}
                          >
                            {formData.watermark.text}{" "}
                          </span>
                        );
                      }
                    }
                    return marks;
                  })()}
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                
                {formData.logo_url && (
                  <div className="flex-shrink-0 mb-4">
                    <img
                      src={
                        formData.logo_url.startsWith("assets/")
                          ? `${SITE_URL}/${formData.logo_url}`
                          : formData.logo_url
                      }
                      alt="Logo Preview"
                      className="w-[190px] h-[90px] md:w-[190px] md:h-[90px] object-contain rounded-lg"
                    />
                  </div>
                )}

                <div className="flex flex-col justify-center text-center md:text-center flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight dark:text-black">
                    {formData.title}
                  </h1>
                  <p className="text-base md:text-lg mt-1 text-gray-400 dark:text-gray-600">
                    {formData.description}
                  </p>
                </div>
              </div>

              <div
                className="mb-4 px-4 py-2 rounded-lg w-full relative z-10"
                style={{ backgroundColor: formData.category_bg }}
              >
                <span className="text-white font-medium">Electrónicos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;