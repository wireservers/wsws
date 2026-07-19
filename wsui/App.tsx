import "./global.css";

import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Badge,
  BadgeText,
  Button,
  ButtonText,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DataGrid,
  Input,
  InputField,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Switch,
} from "@wireservers-ui/react-natives";
import type {
  DataGridCell,
  DataGridColumn,
  DataGridRenderCellInfo,
} from "@wireservers-ui/react-natives";

const links = [
  { label: "Open docs", url: "https://www.reactnatives.dev" },
  {
    label: "View package",
    url: "https://www.npmjs.com/package/@wireservers-ui/react-natives",
  },
  {
    label: "GitHub",
    url: "https://github.com/wireservers/wireservers-ui",
  },
];

const gridRows = [
  {
    component: "Button",
    kind: "Action",
    status: "Ready",
    score: 98,
    shipped: true,
    docs: "Buttons",
    link: "https://www.reactnatives.dev/components/docs/button",
    release: "**2.0** stable",
    owner: "Core",
    color: "#0f766e",
  },
  {
    component: "Input",
    kind: "Form",
    status: "Ready",
    score: 94,
    shipped: true,
    docs: "Inputs",
    link: "https://www.reactnatives.dev/components/docs/input",
    release: "**2.0** stable",
    owner: "Forms",
    color: "#2563eb",
  },
  {
    component: "DataGrid",
    kind: "Data",
    status: "New",
    score: 91,
    shipped: true,
    docs: "Grid",
    link: "https://www.reactnatives.dev/components/docs/data-grid",
    release: "**Sorting**, filtering, selection",
    owner: "Data",
    color: "#7c3aed",
  },
  {
    component: "Drawer",
    kind: "Overlay",
    status: "Ready",
    score: 89,
    shipped: true,
    docs: "Drawer",
    link: "https://www.reactnatives.dev/components/docs/drawer",
    release: "Panel workflow",
    owner: "Overlay",
    color: "#ea580c",
  },
  {
    component: "DatePicker",
    kind: "Form",
    status: "Preview",
    score: 84,
    shipped: false,
    docs: "Dates",
    link: "https://www.reactnatives.dev/components/docs/date-picker",
    release: "Calendar input",
    owner: "Forms",
    color: "#0891b2",
  },
  {
    component: "Toast",
    kind: "Feedback",
    status: "Ready",
    score: 87,
    shipped: true,
    docs: "Toast",
    link: "https://www.reactnatives.dev/components/docs/toast",
    release: "Transient alerts",
    owner: "Feedback",
    color: "#16a34a",
  },
];

const columns: DataGridColumn[] = [
  { id: "component", title: "Component", group: "Identity", width: 160 },
  { id: "kind", title: "Type", group: "Identity", kind: "bubble", width: 120 },
  { id: "status", title: "Status", group: "State", kind: "bubble", width: 120 },
  {
    id: "score",
    title: "Score",
    group: "State",
    kind: "number",
    width: 90,
    align: "right",
  },
  { id: "shipped", title: "Shipped", group: "State", kind: "boolean", width: 100 },
  { id: "docs", title: "Docs", group: "Links", kind: "uri", width: 120 },
  { id: "release", title: "Notes", group: "Rich cells", kind: "markdown", width: 210 },
  { id: "owner", title: "Owner", group: "Rich cells", kind: "drilldown", width: 130 },
  { id: "color", title: "Theme", group: "Rich cells", kind: "custom", width: 110 },
];

function openUrl(url: string) {
  void Linking.openURL(url);
}

export default function App() {
  const [density, setDensity] = useState(62);
  const [enabled, setEnabled] = useState(true);
  const [projectName, setProjectName] = useState("Atlas Mobile");
  const [selectedRows, setSelectedRows] = useState<number[]>([0, 2]);
  const [lastEdit, setLastEdit] = useState("Long-press editable cells");

  const gridCells = useMemo(
    () => (row: number, column: DataGridColumn): DataGridCell | string | number | boolean => {
      const item = gridRows[row];
      const value = item[column.id as keyof typeof item];
      if (column.id === "docs") {
        return { kind: "uri", value: item.docs, href: item.link };
      }
      if (column.id === "color") {
        return {
          kind: "custom",
          value: item.color,
          displayValue: item.owner,
          accessibilityLabel: `${item.owner} theme color ${item.color}`,
        };
      }
      return value;
    },
    [],
  );

  const renderGridCell = ({ column, cell }: DataGridRenderCellInfo) => {
    if (column.id !== "color") return undefined;
    const color = String(cell.value ?? "#0f766e");
    return (
      <View style={styles.swatchCell}>
        <View style={[styles.swatch, { backgroundColor: color }]} />
        <Text style={styles.swatchText}>{cell.displayValue}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View>
              <Text style={styles.eyebrow}>WireServers UI</Text>
              <Text style={styles.brand}>React Natives</Text>
            </View>
          </View>

          <View style={styles.heroCopy}>
            <Badge variant="subtle" action="primary" size="lg">
              <BadgeText>Expo starter with real components</BadgeText>
            </Badge>
            <Text style={styles.title}>Build clean Expo apps faster.</Text>
            <Text style={styles.subtitle}>
              This starter renders actual library primitives: actions, form
              controls, stats, cards, and a sortable data grid.
            </Text>
          </View>

          <View style={styles.linkRow}>
            {links.map((link, index) => (
              <Button
                key={link.url}
                action={index === 0 ? "primary" : "default"}
                variant={index === 0 ? "solid" : "outline"}
                size="lg"
                onPress={() => openUrl(link.url)}
              >
                <ButtonText>{link.label}</ButtonText>
              </Button>
            ))}
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat style={styles.statBox}>
            <StatLabel>Components</StatLabel>
            <StatNumber>70+</StatNumber>
            <StatHelpText>App-ready primitives</StatHelpText>
          </Stat>
          <Stat style={styles.statBox}>
            <StatLabel>Platforms</StatLabel>
            <StatNumber>3</StatNumber>
            <StatHelpText>Web, iOS, Android</StatHelpText>
          </Stat>
          <Stat style={styles.statBox}>
            <StatLabel>Setup</StatLabel>
            <StatNumber>1 cmd</StatNumber>
            <StatHelpText>Expo-aware init</StatHelpText>
          </Stat>
        </View>

        <View style={styles.examplesGrid}>
          <Card variant="outline" size="lg" style={styles.exampleCard}>
            <CardHeader>
              <Text style={styles.cardTitle}>Actions</Text>
              <Badge action="success" variant="subtle">
                <BadgeText>Live</BadgeText>
              </Badge>
            </CardHeader>
            <CardBody>
              <Text style={styles.cardText}>
                Button variants are ready for primary, secondary, and neutral
                workflows.
              </Text>
            </CardBody>
            <CardFooter>
              <View style={styles.buttonStack}>
                <Button action="primary" size="md">
                  <ButtonText>Create</ButtonText>
                </Button>
                <Button action="default" variant="outline" size="md">
                  <ButtonText>Review</ButtonText>
                </Button>
              </View>
            </CardFooter>
          </Card>

          <Card variant="outline" size="lg" style={styles.exampleCard}>
            <CardHeader>
              <Text style={styles.cardTitle}>Forms</Text>
              <Switch value={enabled} onToggle={setEnabled} />
            </CardHeader>
            <CardBody>
              <Input size="lg" variant="outline">
                <InputField
                  value={projectName}
                  onChangeText={setProjectName}
                  placeholder="Project name"
                />
              </Input>
              <Text style={styles.helperText}>
                Inputs, switches, pickers, sliders, and validation states share
                one token system.
              </Text>
            </CardBody>
          </Card>

          <Card variant="outline" size="lg" style={styles.exampleCard}>
            <CardHeader>
              <Text style={styles.cardTitle}>Tuning</Text>
              <Badge action="info" variant="subtle">
                <BadgeText>{density}%</BadgeText>
              </Badge>
            </CardHeader>
            <CardBody>
              <Slider
                value={density}
                onValueChange={setDensity}
                min={0}
                max={100}
                size="lg"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Text style={styles.helperText}>
                Interactive controls work across touch, mouse, and keyboard
                driven surfaces.
              </Text>
            </CardBody>
          </Card>

          <Card variant="outline" size="lg" style={styles.gridCard}>
            <CardHeader>
              <Text style={styles.cardTitle}>DataGrid</Text>
              <Badge action="warning" variant="subtle">
                <BadgeText>Feature showcase</BadgeText>
              </Badge>
            </CardHeader>
            <CardBody>
              <Text style={styles.helperTextTop}>
                Sort, filter, select rows, resize or reorder columns, and
                long-press editable cells. Selected rows: {selectedRows.length}.
              </Text>
              <DataGrid
                columns={columns}
                rowCount={gridRows.length}
                getCellContent={gridCells}
                renderCell={renderGridCell}
                onCellEdit={(event) =>
                  setLastEdit(`${event.column.title}: ${String(event.value)}`)
                }
                editable
                selectionMode="multiple"
                selectionScope="row"
                selection={{ rows: selectedRows }}
                onSelectionChange={(selection) =>
                  setSelectedRows(selection.rows ?? [])
                }
                sortable
                filterable
                allowColumnResize
                allowColumnReorder
                stickyHeader
                defaultSort={{ columnId: "score", direction: "desc" }}
                mergedCells={[{ row: 0, columnId: "release", colSpan: 2 }]}
                rowHeight={(row) => (row === 2 ? 58 : 44)}
                estimatedRowHeight={48}
                style={styles.dataGrid}
              />
              <View style={styles.gridFooter}>
                <Badge action="info" variant="subtle">
                  <BadgeText>{lastEdit}</BadgeText>
                </Badge>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setSelectedRows([])}
                  style={styles.clearSelectionButton}
                >
                  <Text style={styles.clearSelectionText}>Clear selection</Text>
                </Pressable>
              </View>
            </CardBody>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  page: {
    flexGrow: 1,
    gap: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  header: {
    alignSelf: "center",
    maxWidth: 980,
    width: "100%",
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 32,
  },
  eyebrow: {
    color: "#0f766e",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  brand: {
    color: "#101828",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0,
  },
  heroCopy: {
    alignItems: "flex-start",
    gap: 16,
  },
  title: {
    color: "#101828",
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 52,
    maxWidth: 760,
  },
  subtitle: {
    color: "#475467",
    fontSize: 19,
    lineHeight: 29,
    maxWidth: 760,
  },
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 28,
  },
  statsRow: {
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    maxWidth: 980,
    width: "100%",
  },
  statBox: {
    backgroundColor: "#ffffff",
    borderColor: "#d9e2ec",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: 220,
    flexGrow: 1,
    padding: 18,
  },
  examplesGrid: {
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    maxWidth: 980,
    width: "100%",
  },
  exampleCard: {
    flexBasis: 300,
    flexGrow: 1,
    minHeight: 230,
  },
  gridCard: {
    flexBasis: 620,
    flexGrow: 1,
  },
  cardTitle: {
    color: "#101828",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0,
  },
  cardText: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
  },
  helperText: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
  },
  helperTextTop: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  buttonStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dataGrid: {
    height: 360,
    minWidth: 620,
  },
  swatchCell: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  swatch: {
    borderColor: "#cbd5e1",
    borderRadius: 4,
    borderWidth: 1,
    height: 18,
    width: 18,
  },
  swatchText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
  },
  gridFooter: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  clearSelectionButton: {
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearSelectionText: {
    color: "#0f766e",
    fontSize: 13,
    fontWeight: "800",
  },
});
