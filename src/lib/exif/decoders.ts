// Small decoders for the metadata formats the container walker lifts out:
// XMP (RDF/XML), IPTC IIM and the description inside an ICC profile. Hand
// written rather than DOMParser-based so they behave the same in a worker,
// in tests under Node and in every browser.

export type XmpProp = { ns: string; prefix: string; name: string; value: string };

type XmlNode = { name: string; attrs: Record<string, string>; children: XmlNode[]; text: string };

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decodeEntities(s: string): string {
	return s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e: string) => {
		if (e[0] === '#') {
			const code =
				e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
			return Number.isFinite(code) ? String.fromCodePoint(code) : m;
		}
		return ENTITIES[e] ?? m;
	});
}

/** A tolerant XML reader: enough for XMP packets, which carry no DTDs. */
function parseXml(src: string): XmlNode {
	const root: XmlNode = { name: '#root', attrs: {}, children: [], text: '' };
	const stack = [root];
	const re =
		/<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[([\s\S]*?)\]\]>|<!(?:[^>]*)>|<\/([^\s>]+)\s*>|<([^\s/>]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(src))) {
		const top = stack[stack.length - 1];
		if (m[1] !== undefined) top.text += m[1];
		else if (m[2]) {
			if (stack.length > 1) stack.pop();
		} else if (m[3]) {
			const attrs: Record<string, string> = {};
			const ar = /([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
			let a: RegExpExecArray | null;
			while ((a = ar.exec(m[4]))) attrs[a[1]] = decodeEntities(a[3] ?? a[4] ?? '');
			const node: XmlNode = { name: m[3], attrs, children: [], text: '' };
			top.children.push(node);
			if (!m[5]) stack.push(node);
		} else if (m[6] !== undefined) top.text += decodeEntities(m[6]);
	}
	return root;
}

const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

/** Every property in an XMP packet, structures and lists flattened to text. */
export function parseXmp(text: string): XmpProp[] {
	const out: XmpProp[] = [];
	const root = parseXml(text);

	// Namespace scopes are inherited; XMP declares them on rdf:RDF or on each
	// rdf:Description, so a running map per path is enough.
	const resolve = (qname: string, ns: Record<string, string>) => {
		const c = qname.indexOf(':');
		const prefix = c < 0 ? '' : qname.slice(0, c);
		return { prefix, name: c < 0 ? qname : qname.slice(c + 1), uri: ns[prefix] ?? '' };
	};
	const scope = (node: XmlNode, ns: Record<string, string>) => {
		let next = ns;
		for (const [k, v] of Object.entries(node.attrs)) {
			if (k.startsWith('xmlns:')) {
				if (next === ns) next = { ...ns };
				next[k.slice(6)] = v;
			}
		}
		return next;
	};

	const valueOf = (node: XmlNode, ns: Record<string, string>): string => {
		ns = scope(node, ns);
		const res = Object.entries(node.attrs).find(
			([k]) => resolve(k, ns).uri === RDF && /resource$/.test(k)
		);
		if (res) return res[1];
		const list = node.children.find((c) => /^(Seq|Bag|Alt)$/.test(resolve(c.name, ns).name));
		if (list) {
			const lns = scope(list, ns);
			return list.children
				.map((li) => valueOf(li, lns))
				.filter(Boolean)
				.join(', ');
		}
		// A structure: rdf:parseType="Resource", a nested Description, or
		// attributes holding the fields.
		const parts: string[] = [];
		const fields = node.children.flatMap((c) =>
			resolve(c.name, ns).name === 'Description' && resolve(c.name, ns).uri === RDF ? [c] : []
		);
		const holders = fields.length ? fields : [node];
		for (const h of holders) {
			const hns = scope(h, ns);
			for (const [k, v] of Object.entries(h.attrs)) {
				const q = resolve(k, hns);
				if (k.startsWith('xmlns') || q.uri === RDF || k.startsWith('xml:')) continue;
				parts.push(`${q.name}: ${v}`);
			}
			for (const c of h.children) {
				const q = resolve(c.name, hns);
				if (q.uri === RDF) continue;
				const v = valueOf(c, hns);
				if (v) parts.push(`${q.name}: ${v}`);
			}
		}
		if (parts.length) return parts.join('; ');
		return node.text.trim();
	};

	const visitDescription = (d: XmlNode, ns: Record<string, string>) => {
		ns = scope(d, ns);
		for (const [k, v] of Object.entries(d.attrs)) {
			if (k.startsWith('xmlns') || k.startsWith('xml:')) continue;
			const q = resolve(k, ns);
			if (q.uri === RDF) continue;
			out.push({ ns: q.uri, prefix: q.prefix, name: q.name, value: v });
		}
		for (const c of d.children) {
			const q = resolve(c.name, ns);
			if (q.uri === RDF) continue;
			out.push({ ns: q.uri, prefix: q.prefix, name: q.name, value: valueOf(c, ns) });
		}
	};

	const walk = (node: XmlNode, ns: Record<string, string>) => {
		ns = scope(node, ns);
		for (const c of node.children) {
			const q = resolve(c.name, ns);
			if (q.uri === RDF && q.name === 'Description') visitDescription(c, ns);
			else walk(c, ns);
		}
	};
	walk(root, {});
	return out;
}

// ---------------------------------------------------------------- IPTC

/** Record 2 (application) dataset names, as Photoshop and ExifTool label them. */
export const IPTC_NAMES: Record<number, string> = {
	0: 'RecordVersion',
	5: 'ObjectName',
	7: 'EditStatus',
	10: 'Urgency',
	15: 'Category',
	20: 'SupplementalCategories',
	25: 'Keywords',
	40: 'SpecialInstructions',
	55: 'DateCreated',
	60: 'TimeCreated',
	62: 'DigitalCreationDate',
	63: 'DigitalCreationTime',
	65: 'OriginatingProgram',
	70: 'ProgramVersion',
	80: 'By-line',
	85: 'By-lineTitle',
	90: 'City',
	92: 'Sub-location',
	95: 'Province-State',
	100: 'Country-PrimaryLocationCode',
	101: 'Country-PrimaryLocationName',
	103: 'OriginalTransmissionReference',
	105: 'Headline',
	110: 'Credit',
	115: 'Source',
	116: 'CopyrightNotice',
	118: 'Contact',
	120: 'Caption-Abstract',
	122: 'Writer-Editor'
};

export function parseIptc(b: Uint8Array): { name: string; value: string }[] {
	const out = new Map<string, string[]>();
	let utf = false;
	let i = 0;
	while (i + 5 <= b.length) {
		if (b[i] !== 0x1c) {
			i++;
			continue;
		}
		const rec = b[i + 1];
		const ds = b[i + 2];
		let len = (b[i + 3] << 8) | b[i + 4];
		let at = i + 5;
		if (len & 0x8000) {
			const n = len & 0x7fff;
			len = 0;
			for (let j = 0; j < n; j++) len = len * 256 + b[at + j];
			at += n;
		}
		const data = b.subarray(at, at + len);
		if (rec === 1 && ds === 90 && data[0] === 0x1b && data[1] === 0x25 && data[2] === 0x47)
			utf = true;
		if (rec === 2) {
			const name = IPTC_NAMES[ds] ?? `Dataset ${ds}`;
			const value =
				ds === 0
					? String((data[0] << 8) | data[1])
					: new TextDecoder(utf ? 'utf-8' : 'latin1').decode(data);
			out.set(name, [...(out.get(name) ?? []), value.replace(/\0+$/, '')]);
		}
		i = at + len;
	}
	return [...out].map(([name, values]) => ({ name, value: values.join(', ') }));
}

// ---------------------------------------------------------------- ICC

/** The profile's description ("Display P3", "sRGB IEC61966-2.1"). */
export function iccDescription(b: Uint8Array): string {
	if (b.length < 132) return '';
	const u32 = (o: number) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
	const n = u32(128);
	for (let k = 0; k < n; k++) {
		const e = 132 + k * 12;
		if (e + 12 > b.length) break;
		if (u32(e) !== 0x64657363) continue; // 'desc'
		const off = u32(e + 4);
		const type = String.fromCharCode(b[off], b[off + 1], b[off + 2], b[off + 3]);
		if (type === 'desc') {
			const len = u32(off + 8);
			return new TextDecoder('latin1')
				.decode(b.subarray(off + 12, off + 12 + len))
				.replace(/\0+$/, '');
		}
		if (type === 'mluc') {
			const recLen = u32(off + 12);
			if (u32(off + 8) < 1 || recLen < 12) return '';
			const len = u32(off + 20);
			const at = off + u32(off + 24);
			return new TextDecoder('utf-16be').decode(b.subarray(at, at + len)).replace(/\0+$/, '');
		}
	}
	return '';
}
