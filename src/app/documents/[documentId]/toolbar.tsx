"use client";

import{ type ColorResult, CirclePicker, SketchPicker } from "react-color";
import { LucideIcon, Redo2Icon, Undo2Icon, PrinterIcon, SpellCheckIcon, BoldIcon, ItalicIcon, UnderlineIcon, MessageSquarePlusIcon, ListTodoIcon, RemoveFormattingIcon, ChevronDownIcon, HighlighterIcon, Link2Icon, ImageIcon, UploadIcon, SearchIcon } from "lucide-react";
import { type Level } from "@tiptap/extension-heading";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const ImageButton = () => {
    const { editor } = useEditorStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const onChange = (src: string) => {
        editor?.chain().focus().setImage({src}).run();
    };

    const onUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                onChange(imageUrl);
            }
        }

        input.click();
    };
    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            onChange(imageUrl);
            setImageUrl("");
            setIsDialogOpen(false);
        }     
    };
    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button 
                className="h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                   <ImageIcon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={onUpload}>
                    <UploadIcon className="size-4 mr-2" />
                    Upload
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    <SearchIcon className="size-4 mr-2" />
                    Paste image url
                </DropdownMenuItem>

                
            </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                   <DialogTitle>Insert Image URL</DialogTitle> 
                </DialogHeader>
                <Input
                placeholder="Insert image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleImageUrlSubmit();
                    }
                }}
                />
                <DialogFooter>
                <Button onClick={handleImageUrlSubmit}>
                Insert
                </Button>

            </DialogFooter>
            </DialogContent>
            
        </Dialog>
        </>
        
    );
};

const LinkButton = () => {
    const { editor } = useEditorStore();
    const [value, setValue] = useState("");

    const onChange = (href: string) => {
        editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
        setValue("");
    };
    return (
        <DropdownMenu onOpenChange={() => {
            if (open()) {
                setValue(editor?.getAttributes("link").href || "");
            }
            
        }}>
            
            <DropdownMenuTrigger asChild>
                <button 
                className="h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                   <Link2Icon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
                <Input 
                 placeholder="https://example.com"
                 value={value}
                 onChange={(e) => setValue(e.target.value)}
                 />
                <Button onClick={() => onChange(value)}>
                    Apply
                    </Button>

                
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
const HighlightColorButton = () => {
    const { editor } = useEditorStore();

    const value = editor?.getAttributes("highlight").color || "#FFFFFFFF";
    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({ color: color.hex }).run();
    };
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                   <HighlighterIcon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5">
                <SketchPicker
                color = {value} 
                onChange={onChange} 
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


const TextColorButton = () => {
    const { editor } = useEditorStore();

    const value = editor?.getAttributes("textStyle").color || "#000000";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    };
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className= "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
                >
                    <span className="text-xs">A</span>
                    <div className="h-0.5 w-full" style={{ backgroundColor: value}}/>
                </button>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <SketchPicker
                color={value}
                onChange={onChange}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const HeadingLeveleButton = () => {
    const { editor } = useEditorStore();

    const headings = [
        { label: "Normal text", value: 0, fontSize: "16px"},
        { label: "Heading 1", value: 1, fontSize: "32px"},
        { label: "Heading 2", value: 2, fontSize: "24px"},
        { label: "Heading 3", value: 3, fontSize: "20px"},
        { label: "Heading 4", value: 4, fontSize: "18px"},
        { label: "Heading 5", value: 5, fontSize: "16px"},
    ];
    const getCurrentHeading =() => {
        for (let level = 1; level <= 5; level++){
            if (editor?.isActive("heading", { level })) {
                return `Heading ${level}`;
            }
        }
        return "Normal text";
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <button
                className= "h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <span className="truncate">
                        {getCurrentHeading()}
                    </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {headings.map(({label,value,fontSize}) => (
                    <button
                    key={value}
                    style={{ fontSize }}
                    onClick={() => {
                        if (value === 0) {
                            editor?.chain().focus().setParagraph().run();
                        } else {
                            editor?.chain().focus().toggleHeading({ level: value as Level}).run();
                        }
                    }}
                    className={cn(
                        "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                        (value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", {level: value}) && "bg-neutral-200/80"
                    )}
                    >
                        {label}
                    </button>
                ))}

            </DropdownMenuContent>
        </DropdownMenu>
    )
};


const FontFamilyButton = () => {
    const { editor } = useEditorStore();

    const fonts = [
        {label: "Arial", value: "Arial"},
        {label: "Times New Roman", value: "Times New Roman"},
        {label: "Courier New", value: "Courier New"},
        {label: "Georgia", value: "Georgia"},
        {label: "Verdana", value: "Verdana"},
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className= "h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                    <span className="truncate">
                        {editor?.getAttributes("textstyle").fontfamily || "Arial"}
                    </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className ="p-1 flex flex-col gap-y-1">
                {fonts.map(({label,value}) =>(
                    <button
                    onClick={() => editor?.chain().focus().setFontFamily(value).run()}
                        key={value}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                            editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80"
                        )}
                        style = {{ fontFamily: value}}
                    >
                        <span className="text-sm">
                            { label }
                        </span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
}

const ToolbarButton = ({ 
    onClick, // Function to run when button is clicked
    isActive, // Whether the button is active (true/false)
    icon: Icon, // The icon component for the button (e.g., Undo2Icon)
}: ToolbarButtonProps) => {
    return (
        <button 
            onClick={onClick} // Calls the function when clicked
            className={cn(
                "text-sm h-7 min-w-7 flex-items-center justify-center rounded-sm hover:bg-neutral-200/80",
                isActive && "bg-neutral-200/80" // If active, apply background color
        )}
        >
            
            <Icon className="size-4" />
        </button>
    )

}

export const Toolbar = () => {
    const { editor } = useEditorStore();

    console.log("Toolbar editor: ", { editor })
    const sections: { label: string;
                      icon: LucideIcon;
                      onClick: () => void ;
                      isActive?: boolean;
                    }[][] = [
                        [
                            {
                                label: "undo", //Button name
                                icon: Undo2Icon, //Icon component
                                onClick: () => editor?.chain().focus().undo().run(),
                            },
                            {
                               label: "Redo",
                               icon: Redo2Icon,
                               onClick: () => editor?.chain().focus().redo().run(),
                            },
                            {
                                label: "Print",
                                icon: PrinterIcon,
                                onClick: () => window.print(),
                            },
                            {
                                label: "Spell Check",
                                icon: SpellCheckIcon,
                                onClick: () => {
                                    const current = editor?.view.dom.getAttribute("spellcheck");
                                    editor?.view.dom.setAttribute("spellcheck", current === "false" ? "true" : "false")
                                },
                            }
                        ],
                        [
                            {
                                label: "Bold",
                                icon: BoldIcon,
                                isActive: editor?.isActive("bold"),
                                onClick: () => editor?.chain().focus().toggleBold().run(),
                            },
                            {
                                label: "Italic",
                                icon: ItalicIcon,
                                isActive: editor?.isActive("italic"),
                                onClick: () => editor?.chain().focus().toggleItalic().run(),
                            },
                            {
                                label: "UnderLine",
                                icon: UnderlineIcon,
                                isActive: editor?.isActive("underline"),
                                onClick: () => editor?.chain().focus().toggleUnderline().run(),
                            },
                        ],
                        [
                            {
                                label: "Comment",
                                icon: MessageSquarePlusIcon,
                                isActive: false,
                                onClick: () => console.log("TODO: Comment"),
                            },

                            {
                                label: "List Todo",
                                icon: ListTodoIcon,
                                isActive: editor?.isActive("taskList"),
                                onClick: () => editor?.chain().focus().toggleTaskList().run(),
                            
                            },
                            {
                                label: "Remove Formatting",
                                icon: RemoveFormattingIcon,
                                onClick: () => editor?.chain().focus().unsetAllMarks().run(),
                            
                            },
                        ]
                        
                    ];
    return (
        <div className="bd-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
            {sections[0].map((item) => (
                <ToolbarButton key={item.label} {...item} /> //<ToolbarButton key={item.label} icon={item.icon} onClick={item.onClick} isActive={item.isActive}                 
            ))}
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            <FontFamilyButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            <HeadingLeveleButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            {/*TODO: Font size*/}
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            {sections[1].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}
            <TextColorButton />
            <HighlightColorButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            <LinkButton />
            <ImageButton />
            {/* TODO: Align*/}
            {/* TODO: Line Height*/}
            {/* TODO: List*/}
            {sections[2].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}
        </div>
    );
};